import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveJobsToBackend, fetchJobsByDate } from '../api/jobService';
import { updateJobStatus, addJobComment } from '../api/updateJobStatus';
// Async thunk to add a comment to a job
export const addJobCommentThunk = createAsyncThunk(
  'jobs/addJobComment',
  async ({ jobId, comment }, { rejectWithValue }) => {
    try {
      const updated = await addJobComment(jobId, comment);
      return { jobId, comments: updated.comments };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// Async thunk to update job status
export const updateJobStatusThunk = createAsyncThunk(
  'jobs/updateJobStatus',
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const updated = await updateJobStatus(jobId, status);
      return { jobId, status: updated.status };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
import { normalizeJob } from '../utils/normalizeJob';
import { fetchJobById } from '../api/jobService'; 

// Async thunk to save jobs to backend
export const saveJobsToBackendThunk = createAsyncThunk('jobs/saveJobsToBackend', async (jobs, { rejectWithValue }) => {
  try {
    // jobs should be normalized before calling this thunk
    await saveJobsToBackend(jobs);
    return true;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});
export const fetchJobByIdThunk = createAsyncThunk(
  'jobs/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      const job = await fetchJobById(id);
      return job;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to fetch jobs grouped by date from backend
export const fetchJobsByDateThunk = createAsyncThunk('jobs/fetchJobsByDate', async ({ range, page, limit }, { rejectWithValue }) => {
  try {
    const data = await fetchJobsByDate(range, page, limit);
    // Each data item: { date, jobs: [...] }
    // Normalize jobs in each group
    return data.map(day => ({
      date: day.date,
      jobs: (day.jobs || []).map(normalizeJob)
    }));
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobsByDate: [], // [{date, jobs:[]}, ...]
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    range: '7d',
  },
  reducers: {
    resetJobsByDate(state) {
      state.jobsByDate = [];
      state.page = 1;
      state.hasMore = true;
    },
    setRange(state, action) {
      state.range = action.payload;
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveJobsToBackendThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveJobsToBackendThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveJobsToBackendThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to save jobs.';
      })
      .addCase(fetchJobsByDateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobsByDateThunk.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.jobsByDate = action.payload;
        } else {
          // Append new days, avoid duplicates
          const existingDates = new Set(state.jobsByDate.map(d => d.date));
          const newDays = action.payload.filter(d => !existingDates.has(d.date));
          state.jobsByDate = [...state.jobsByDate, ...newDays];
        }
        state.loading = false;
        state.error = null;
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchJobsByDateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch jobs.';
      })
      .addCase(updateJobStatusThunk.fulfilled, (state, action) => {
        // Update job status in jobsByDate
        const { jobId, status } = action.payload;
        state.jobsByDate.forEach(day => {
          day.jobs.forEach(job => {
            if (String(job.id) === String(jobId)) {
              job.status = status;
            }
          });
        });
      })
      .addCase(addJobCommentThunk.fulfilled, (state, action) => {
        // Update job comments in jobsByDate
        const { jobId, comments } = action.payload;
        state.jobsByDate.forEach(day => {
          day.jobs.forEach(job => {
            if (String(job.id) === String(jobId)) {
              job.comments = comments;
            }
          });
        });
      });
  },
});

export const { resetJobsByDate, setRange } = jobsSlice.actions;
export default jobsSlice.reducer; 