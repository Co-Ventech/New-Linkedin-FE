import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJobs, getScoredJobs } from '../api/jobService';
import { normalizeJob } from '../utils/normalizeJob';

// Async thunk to fetch jobs from API
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { rejectWithValue }) => {
  try {
    const jobs = await getJobs();
    // Normalize all jobs before returning
    return jobs.map(normalizeJob);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchScoredJobs = createAsyncThunk('jobs/fetchScoredJobs', async (_, { rejectWithValue }) => {
  try {
    const jobs = await getScoredJobs();
    return jobs.map(normalizeJob);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    loadJobsFromStorage(state) {
      try {
        const stored = localStorage.getItem('scoredJobs');
        if (stored) {
          state.jobs = JSON.parse(stored);
        }
      } catch {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
        state.error = null;
        try { localStorage.setItem('scoredJobs', JSON.stringify(action.payload)); } catch {}
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch jobs.';
      })
      .addCase(fetchScoredJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScoredJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
        state.error = null;
        try { localStorage.setItem('scoredJobs', JSON.stringify(action.payload)); } catch {}
      })
      .addCase(fetchScoredJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch scored jobs.';
      });
  },
});

export const { loadJobsFromStorage } = jobsSlice.actions;
export default jobsSlice.reducer; 