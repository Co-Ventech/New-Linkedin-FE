import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveJobsToBackend, fetchJobsByDate } from '../api/jobService';
import { updateJobStatus, addJobComment} from '../api/updateJobStatus';
// import { updateJobStatus, addJobComment, updateUpworkJobStatus, updateUpworkAeComment, addUpworkJobComment } from '../api/updateJobStatus';
import { updateAeComment } from '../api/updateJobStatus';

// Async thunk to add a comment to a job
export const addJobCommentThunk = createAsyncThunk(
  'jobs/addJobComment',
  async ({ jobId, username, comment }, { rejectWithValue }) => {
    try {
      const updated = await addJobComment(jobId, { username, comment });
      return { jobId, comments: updated.comments };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
// Async thunk to update job status
export const updateJobStatusThunk = createAsyncThunk(
  'jobs/updateJobStatus',
  async ({ jobId, status, username }, { rejectWithValue }) => {
    try {
      const updated = await updateJobStatus(jobId, { status, username });
      return { jobId, status: updated.status, currentStatus: updated.currentStatus, statusHistory: updated.statusHistory };
    } catch (err) {
      // Add this:
      console.error("updateJobStatusThunk error:", err, err.response?.data);
      return rejectWithValue(err.response?.data?.message || err.message);
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

export const updateAeCommentThunk = createAsyncThunk(
  'jobs/updateAeComment',
  async ({ jobId, ae_comment }, { rejectWithValue }) => {
    try {
      const updated = await updateAeComment(jobId, ae_comment);
      return { jobId, ae_comment: updated.ae_comment };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// export const updateUpworkJobStatusThunk = createAsyncThunk(
//   'upworkJobs/updateJobStatus',
//   async ({ jobId, status, username }, { rejectWithValue }) => {
//     try {
//       const updated = await updateUpworkJobStatus(jobId, { status, username }); // points to Upwork API
//       return { jobId, status: updated.status, currentStatus: updated.currentStatus, statusHistory: updated.statusHistory };
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const updateUpworkAeCommentThunk = createAsyncThunk(
//   'upworkJobs/updateAeComment',
//   async ({ jobId, ae_comment }, { rejectWithValue }) => {
//     try {
//       const updated = await updateUpworkAeComment(jobId, ae_comment);
//       return { jobId, ae_comment: updated.ae_comment };
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const addUpworkJobCommentThunk = createAsyncThunk(
//   'upworkJobs/addJobComment',
//   async ({ jobId, username, comment }, { rejectWithValue }) => {
//     try {
//       const updated = await addUpworkJobComment(jobId, { username, comment });
//       return { jobId, comments: updated.comments };
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

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
        const { jobId, status, currentStatus, statusHistory } = action.payload;
        state.jobsByDate.forEach(day => {
          day.jobs.forEach(job => {
            if (String(job.id) === String(jobId)) {
              job.status = status;
              job.currentStatus = currentStatus;
              job.statusHistory = statusHistory;
            }
          });
        });
      })
      // .addCase(updateJobStatusThunk.fulfilled, (state, action) => {
      //   // Update job status in jobsByDate
      //   const { jobId, status } = action.payload;
      //   state.jobsByDate.forEach(day => {
      //     day.jobs.forEach(job => {
      //       if (String(job.id) === String(jobId)) {
      //         job.status = status;
      //       }
      //     });
      //   });
      // })
      .addCase(addJobCommentThunk.fulfilled, (state, action) => {
        const { jobId, comments } = action.payload;
        state.jobsByDate.forEach(day => {
          day.jobs.forEach(job => {
            if (String(job.id) === String(jobId)) {
              job.comments = comments;
            }
          });
        });
      })
      .addCase(updateAeCommentThunk.fulfilled, (state, action) => {
        const { jobId, ae_comment } = action.payload;
        state.jobsByDate.forEach(day => {
          day.jobs.forEach(job => {
            if (String(job.id) === String(jobId)) {
              job.ae_comment = ae_comment;
            }
          });
        });
      })
      
      
  },
});

export const { resetJobsByDate, setRange } = jobsSlice.actions;
export default jobsSlice.reducer; 