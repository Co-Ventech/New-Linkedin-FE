import { createSlice } from '@reduxjs/toolkit';
import dummyJobs from '../dummyJobs';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
    loadDummyJobs(state) {
      state.jobs = dummyJobs;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loadDummyJobs } = jobsSlice.actions;
export default jobsSlice.reducer; 