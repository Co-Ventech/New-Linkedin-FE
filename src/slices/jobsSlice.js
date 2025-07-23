import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveJobsToBackend, fetchJobsByDate } from '../api/jobService';
// import { updateJobStatus, addJobComment} from '../api/updateJobStatus';
// import { updateJobStatus, addJobComment, updateUpworkJobStatus, updateUpworkAeComment, addUpworkJobComment } from '../api/updateJobStatus';
// import { updateAeComment } from '../api/updateJobStatus';
import {
  updateJobStatus,
  addJobComment,
  updateAeComment,
  updateUpworkJobStatus,
  updateUpworkAeComment,
  addUpworkJobComment
} from '../api/updateJobStatus';
import axios from "axios";
import { normalizeJob } from '../utils/normalizeJob';
import { fetchJobById } from '../api/jobService'; 

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


export const fetchUpworkJobsByDateThunk = createAsyncThunk(
  'jobs/fetchUpworkJobsByDate',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://44.214.92.17:3000/api/upwork/jobs-by-date", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      const jobs = res.data.jobs || [];
      // Group jobs by date (using ts_publish as YYYY-MM-DD)
      const jobsByDate = {};
      jobs.forEach(job => {
        const date = job.ts_publish ? job.ts_publish.slice(0, 10) : "Unknown";
        if (!jobsByDate[date]) jobsByDate[date] = [];
        jobsByDate[date].push(job);
      });
      // Convert to array of { date, jobs: [...] }
      return Object.entries(jobsByDate).map(([date, jobs]) => ({ date, jobs }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const updateUpworkJobStatusThunk = createAsyncThunk(
  'Jobs/updateUpworkJobStatus',
  async ({ jobId, status, username }, { rejectWithValue }) => {
    try {
      const updated = await updateUpworkJobStatus(jobId, { status, username }); // points to Upwork API
      return { jobId, status: updated.status, currentStatus: updated.currentStatus, statusHistory: updated.statusHistory };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUpworkAeCommentThunk = createAsyncThunk(
  'jobs/updateUpworkAeComment',
  async ({ jobId, ae_comment }, { rejectWithValue }) => {
    try {
      const updated = await updateUpworkAeComment(jobId, ae_comment);
      return { jobId, ae_comment: updated.ae_comment };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addUpworkJobCommentThunk = createAsyncThunk(
  'jobs/addUpworkJobComment',
  async ({ jobId, username, comment }, { rejectWithValue }) => {
    try {
      const updated = await addUpworkJobComment(jobId, { username, comment });
      return { jobId, comments: updated.comments };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobsByDate: [], // [{date, jobs:[]}, ...]
    upworkJobsByDate: [], // <-- add this
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    range: '7d',
  },
  reducers: {
    resetJobsByDate(state) {
      state.jobsByDate = [];
      state.upworkJobsByDate = [];
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
      .addCase(fetchUpworkJobsByDateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpworkJobsByDateThunk.fulfilled, (state, action) => {
        state.upworkJobsByDate = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUpworkJobsByDateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch Upwork jobs.';
      })


      // .addCase(updateUpworkJobStatusThunk.fulfilled, (state, action) => {
      //   const { jobId, status, currentStatus, statusHistory } = action.payload;
      //   state.jobsByDate.forEach(day => {
      //     day.jobs.forEach(job => {
      //       if (String(job.id) === String(jobId)) {
      //         job.status = status;
      //         job.currentStatus = currentStatus;
      //         job.statusHistory = statusHistory;
      //       }
      //     });
      //   });
      // })
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
      .addCase(updateUpworkJobStatusThunk.fulfilled, (state, action) => {
        const { jobId, status, currentStatus, statusHistory } = action.payload;
        state.upworkJobsByDate.forEach(day => {
          day.jobs.forEach(job => {
            if (String(job.jobId) === String(jobId) || String(job.id) === String(jobId)) {
              job.status = status;
              job.currentStatus = currentStatus;
              job.statusHistory = statusHistory;
            }
          });
        });
      })

      // For Upwork AE Remark
.addCase(updateUpworkAeCommentThunk.fulfilled, (state, action) => {
  const { jobId, ae_comment } = action.payload;
  state.upworkJobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.jobId) === String(jobId) || String(job.id) === String(jobId)) {
        job.ae_comment = ae_comment;
      }
    });
  });
})

// For Upwork Comments
.addCase(addUpworkJobCommentThunk.fulfilled, (state, action) => {
  const { jobId, comments } = action.payload;
  state.upworkJobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.jobId) === String(jobId) || String(job.id) === String(jobId)) {
        job.comments = comments;
      }
    });
  });
})
      
  },
});

export const { resetJobsByDate, setRange } = jobsSlice.actions;
export default jobsSlice.reducer; 