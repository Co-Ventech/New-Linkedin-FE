import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveJobsToBackend, fetchJobsByDate } from '../api/jobService';
import { updateEstimatedBudget, updateAePitched, updateAeScore, 
  updateUpworkEstimatedBudget,updateUpworkAePitched,updateUpworkAeScore,generateProposal ,
  updateProposal,generateUpworkProposal,updateUpworkProposal,fetchLinkedinStatusHistory , fetchUpworkStatusHistory,
  updateUpworkJobStatusNew,updateJobStatusNew
 } from '../api/updateJobStatus';
//  import {persistReducer} from 'redux-persist';
//  import storage from 'redux-persist/lib/storage';

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
import { fetchJobById , upworkfetchJobById} from '../api/jobService'; 
const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const PORT = import.meta.env.VITE_PORT;

// Async thunk to add a comment to a job
export const addJobCommentThunk = createAsyncThunk(
  'jobs/addJobComment',
  async ({ jobId, text }, { rejectWithValue }) => {
    try {
      const updated = await addJobComment(jobId, { text });
      return { jobId, job: updated.job };
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
      // Normalize the job before returning
      return normalizeJob(job);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const upworkfetchJobByIdThunk = createAsyncThunk(
  'jobs/upworkfetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const job = await upworkfetchJobById(jobId);
      // Normalize the job before returning
      return job;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to fetch jobs grouped by date from backend
export const fetchJobsByDateThunk = createAsyncThunk(
  'jobs/fetchJobsByDate',
  async ({ range, page, limit }, { rejectWithValue }) => {
    try {
      const data = await fetchJobsByDate(range, page, limit);

      // Filter only LinkedIn jobs
      const linkedinJobs = data.map((day) => ({
        date: day.date,
        jobs: (day.jobs || []).filter((job) => job.platform === 'linkedin'), // Filter LinkedIn jobs
      }));

      return linkedinJobs;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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


// Update the fetchUpworkJobsByDateThunk to use the new API and handle the response properly
export const fetchUpworkJobsByDateThunk = createAsyncThunk(
  'jobs/fetchUpworkJobsByDate',
  async ({ range = '1d', page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      // Use the new API endpoint for company users
      const res = await axios.get(`${import.meta.env.VITE_REMOTE_HOST}/api/company-jobs/user-jobs`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data || {};
      
      // Transform the response to match the expected format for Upwork jobs
      if (data.jobs && Array.isArray(data.jobs)) {
        // Filter only Upwork jobs
        const upworkJobs = data.jobs.filter(job => job.platform === 'upwork');

      // Group by publish date (YYYY-MM-DD) for UI
      const byDate = {};
        upworkJobs.forEach(job => {
          const date = job.ts_publish || job.createdAt || job.distributedAt || new Date().toISOString();
          const dateKey = date.slice(0, 10); // YYYY-MM-DD format
          
          if (!byDate[dateKey]) {
            byDate[dateKey] = [];
          }
          byDate[dateKey].push(job);
      });

      const groups = Object.entries(byDate).map(([date, jobs]) => ({ date, jobs }));
        
        // Sort by date (newest first)
        groups.sort((a, b) => new Date(b.date) - new Date(a.date));
        
      return { groups, page };
      }

      return { groups: [], page };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
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
      console.error("updateUpworkJobStatusThunk error:", err, err.response?.data);
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
  async ({ jobId, text }, { rejectWithValue }) => {
    try {
      const updated = await addUpworkJobComment(jobId, { text });
      return { jobId, job: updated.job };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const updateEstimatedBudgetThunk = createAsyncThunk(
  'jobs/updateEstimatedBudget',
  async ({ jobId, estimated_budget }, { rejectWithValue }) => {
    try {
      await updateEstimatedBudget(jobId, estimated_budget);
      return { jobId, estimated_budget };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAePitchedThunk = createAsyncThunk(
  'jobs/updateAePitched',
  async ({ jobId, ae_pitched }, { rejectWithValue }) => {
    try {
      await updateAePitched(jobId, ae_pitched);
      return { jobId, ae_pitched };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAeScoreThunk = createAsyncThunk(
  'jobs/updateAeScore',
  async ({ jobId, username, ae_score }, { rejectWithValue }) => {
    try {
      await updateAeScore(jobId, { username, ae_score });
      return { jobId, ae_score, username };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUpworkAeScoreThunk = createAsyncThunk(
  'jobs/updateUpworkAeScore',
  async ({ jobId, username, ae_score }, { rejectWithValue }) => {
    try {
      await updateUpworkAeScore(jobId, { username, ae_score });
      return { jobId, ae_score, username };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUpworkAePitchedThunk = createAsyncThunk(
  'jobs/updateUpworkAePitched',
  async ({ jobId, ae_pitched }, { rejectWithValue }) => {
    try {
      await updateUpworkAePitched(jobId, ae_pitched);
      return { jobId, ae_pitched };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const updateUpworkEstimatedBudgetThunk = createAsyncThunk(
  'jobs/updateUpworkEstimatedBudget',
  async ({ jobId, estimated_budget }, { rejectWithValue }) => {
    try {
      await updateUpworkEstimatedBudget(jobId, estimated_budget);
      return { jobId, estimated_budget };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Generate proposal thunk
export const generateProposalThunk = createAsyncThunk(
  'jobs/generateProposal',
  async ({ jobId, selectedCategory, isProduct }, { rejectWithValue }) => {
    try {
      const data = await generateProposal(jobId, selectedCategory, isProduct);
      return { jobId, proposal: data.proposal };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Update proposal thunk
export const updateProposalThunk = createAsyncThunk(
  'jobs/updateProposal',
  async ({ jobId, proposal }, { rejectWithValue }) => {
    try {
      const data = await updateProposal(jobId, proposal);
      return { jobId, proposal: data.proposal };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const generateUpworkProposalThunk = createAsyncThunk(
  'jobs/generateUpworkProposal',
  async ({ jobId, selectedCategory }, { rejectWithValue }) => {
    try {
      const data = await generateUpworkProposal(jobId, selectedCategory);
      return { jobId, proposal: data.proposal };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUpworkProposalThunk = createAsyncThunk(
  'jobs/updateUpworkProposal',
  async ({ jobId, proposal }, { rejectWithValue }) => {
    try {
      const data = await updateUpworkProposal(jobId, proposal);
      return { jobId, proposal: data.proposal };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }

  
);

export const fetchLinkedinStatusHistoryThunk = createAsyncThunk(
  'jobs/fetchLinkedinStatusHistory',
  async ({ date, start, end }, { rejectWithValue }) => {
    try {
      const data = await fetchLinkedinStatusHistory({ date, start, end });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const fetchUpworkStatusHistoryThunk = createAsyncThunk(
  'jobs/fetchUpworkStatusHistory',
  async ({ date, start, end }, { rejectWithValue }) => {
    try {
      const data = await fetchUpworkStatusHistory({ date, start, end });
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCombinedStatusHistoryThunk = createAsyncThunk(
  'jobs/fetchCombinedStatusHistory',
  async ({ date, start, end }, { rejectWithValue }) => {
    try {
      const params = {};
      if (date) params.date = date;
      if (start) params.start = start;
      if (end) params.end = end;
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `${import.meta.env.VITE_REMOTE_HOST}/api/combined/status-history`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchJobsPaginatedThunk = createAsyncThunk(
  'jobs/fetchJobsPaginated',
  async ({ range, page, limit }, { rejectWithValue }) => {
    try {
      const jobs = await fetchLinkedinJobsPaginated({ range, page, limit });
      return { jobs, page };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateJobStatusNewThunk = createAsyncThunk(
  'jobs/updateJobStatusNew',
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const updated = await updateJobStatusNew(jobId, status);
      return { jobId, status, message: updated.message };
    } catch (err) {
      console.error("updateJobStatusNewThunk error:", err, err.response?.data);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUpworkJobStatusNewThunk = createAsyncThunk(
  'jobs/updateUpworkJobStatusNew',
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const updated = await updateUpworkJobStatusNew(jobId, status);
      return { jobId, status, message: updated.message };
    } catch (err) {
      console.error("updateUpworkJobStatusNewThunk error:", err, err.response?.data);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// export const fetchLinkedInJobsByDateThunk = createAsyncThunk(
//   'jobs/fetchLinkedInJobsByDate',
//   async ({ filter, start, end }, { getState, rejectWithValue }) => {
//     const state = getState();
//     if (state.jobs.jobsByFilter[filter]) {
//       // Already have data, skip fetch
//       return rejectWithValue('Already loaded');
//     }
//     // ...fetch from API...
//     const response = await api.get(`/api/linkedin/jobs-by-date?start=${start}&end=${end}`);
//     return { filter, jobs: response.data.jobs };
//   }
// );

// // Repeat for Upwork
const initialState = {
  jobsByDate: [], // [{date, jobs:[]}, ...]
  upworkJobsByDate: [], // <-- add this
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  range: '7d',
  proposals: {}, // { [jobId]: { text, locked } }
  proposalLoading: false,
  proposalError: null,
  upworkProposals: {}, // { [jobId]: { text, locked } }
upworkProposalLoading: false,
upworkProposalError: null,
upworkProposalSaving: false,
upworkProposalSaveError: null,
linkedinStatusHistory: {
  users: [],
  dailyTotals: [],
  grandTotal: {},
},
linkedinStatusLoading: false,
linkedinStatusError: null,
upworkStatusHistory: {
  users: [],
  dailyTotals: [],
  grandTotal: {},
},
upworkStatusLoading: false,
upworkStatusError: null,
combinedStatusHistory: {
  users: [],
  dailyTotals: [],
  grandTotal: {},
},
combinedStatusLoading: false,
combinedStatusError: null,
jobs: [],
hasMore: true,
page: 1,
range: 'last24h',
// selectedFilter: "24hours",
// jobsByFilter: {}, // { "24hours": [...], "7days": [...] }
// upworkJobsByFilter: {},

}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // setSelectedFilter(state, action) {
    //   state.selectedFilter = action.payload;
    // },

    resetJobs(state) {
      state.jobs = [];
      state.page = 1;
      state.hasMore = true;
    },
  
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
    setProposalLoading(state, action) {
      state.proposalLoading = action.payload;
    },
    setUpworkProposalLoading(state, action) {
      state.upworkProposalLoading = action.payload;
    },
 

    
  },
  extraReducers: (builder) => {
    builder

    // .addCase(fetchJobsPaginatedThunk.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(fetchJobsPaginatedThunk.fulfilled, (state, action) => {
    //   if (action.payload.page === 1) {
    //     state.jobs = action.payload.jobs;
    //   } else {
    //     state.jobs = [...state.jobs, ...action.payload.jobs];
    //   }
    //   state.hasMore = action.payload.jobs.length > 0;
    //   state.loading = false;
    // })
    // .addCase(fetchJobsPaginatedThunk.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || 'Failed to fetch jobs.';
    // })

    .addCase(fetchCombinedStatusHistoryThunk.pending, (state) => {
      state.combinedStatusLoading = true;
      state.combinedStatusError = null;
    })
    .addCase(fetchCombinedStatusHistoryThunk.fulfilled, (state, action) => {
      state.combinedStatusLoading = false;
      state.combinedStatusHistory = action.payload;
    })
    .addCase(fetchCombinedStatusHistoryThunk.rejected, (state, action) => {
      state.combinedStatusLoading = false;
      state.combinedStatusError = action.payload;
    })
    .addCase(fetchLinkedinStatusHistoryThunk.pending, (state) => {
      state.linkedinStatusLoading = true;
      state.linkedinStatusError = null;
    })
    .addCase(fetchLinkedinStatusHistoryThunk.fulfilled, (state, action) => {
      state.linkedinStatusLoading = false;
      state.linkedinStatusHistory = action.payload;
    })
    .addCase(fetchLinkedinStatusHistoryThunk.rejected, (state, action) => {
      state.linkedinStatusLoading = false;
      state.linkedinStatusError = action.payload;
    })
.addCase(fetchUpworkStatusHistoryThunk.pending, (state) => {
  state.upworkStatusLoading = true;
  state.upworkStatusError = null;
})
.addCase(fetchUpworkStatusHistoryThunk.fulfilled, (state, action) => {
  state.upworkStatusLoading = false;
  state.upworkStatusHistory = action.payload;
})
.addCase(fetchUpworkStatusHistoryThunk.rejected, (state, action) => {
  state.upworkStatusLoading = false;
  state.upworkStatusError = action.payload;
})
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
  const page = action.meta?.arg?.page || 1;
  const incoming = action.payload || []; // [{date, jobs:[]}, ...]

  if (page === 1 || state.jobsByDate.length === 0) {
    // First page or no existing data - replace everything
    state.jobsByDate = incoming;
  } else {
    // Subsequent pages - merge by date and avoid duplicates
    const byDate = new Map(state.jobsByDate.map((d) => [d.date, d]));

    incoming.forEach((group) => {
      const existing = byDate.get(group.date);
      if (!existing) {
        // New date group - add it
        byDate.set(group.date, { date: group.date, jobs: group.jobs || [] });
      } else {
        // Existing date group - merge jobs and avoid duplicates
        const existingIds = new Set(
          (existing.jobs || []).map((j) => String(j.jobId || j.id || j._id))
        );
        const toAdd = (group.jobs || []).filter(
          (j) => !existingIds.has(String(j.jobId || j.id || j._id))
        );
        existing.jobs = [...(existing.jobs || []), ...toAdd];
      }
    });

    state.jobsByDate = Array.from(byDate.values());
  }

  state.page = page;
  // hasMore: if any group has jobs, assume more; server returns empty page when done
  state.hasMore = incoming.some((g) => (g.jobs?.length || 0) > 0);
  state.loading = false;
  state.error = null;
})
      .addCase(fetchJobsByDateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch jobs.';
      })
      .addCase(fetchUpworkJobsByDateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
// Update the fetchUpworkJobsByDateThunk case in extraReducers
      .addCase(fetchUpworkJobsByDateThunk.fulfilled, (state, action) => {
  const page = action.meta?.arg?.page || 1;
        const incoming = action.payload?.groups || [];
      
        if (page === 1 || state.upworkJobsByDate.length === 0) {
    // First page or no existing data - replace everything
          state.upworkJobsByDate = incoming;
        } else {
    // Subsequent pages - merge by date and avoid duplicates
    const existingByDate = new Map(state.upworkJobsByDate.map(d => [d.date, d]));
    
          incoming.forEach(group => {
      const existing = existingByDate.get(group.date);
            if (!existing) {
        // New date group - add it
        existingByDate.set(group.date, { date: group.date, jobs: group.jobs || [] });
            } else {
        // Existing date group - merge jobs and avoid duplicates
        const existingJobIds = new Set((existing.jobs || []).map(j => j.jobId || j._id || j.id));
        const newJobs = (group.jobs || []).filter(job => {
          const jobId = job.jobId || job._id || job.id;
          return !existingJobIds.has(jobId);
        });
        
        if (newJobs.length > 0) {
          existing.jobs = [...(existing.jobs || []), ...newJobs];
        }
      }
    });
    
    state.upworkJobsByDate = Array.from(existingByDate.values());
  }
  
  // Update pagination state
        state.page = page;
  // hasMore: if we got any jobs, assume there might be more
        state.hasMore = incoming.some(g => (g.jobs?.length || 0) > 0);
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUpworkJobsByDateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch Upwork jobs.';
      })
      .addCase(generateProposalThunk.pending, (state) => {
        state.proposalLoading = true;
        state.proposalError = null;
      })
      .addCase(generateProposalThunk.fulfilled, (state, action) => {
        state.proposalLoading = false;
        state.proposalError = null;
        const { jobId, proposal } = action.payload;
        if (!state.proposals) state.proposals = {};
        state.proposals[jobId] = { text: proposal, locked: false };
      })
      .addCase(generateProposalThunk.rejected, (state, action) => {
        state.proposalLoading = false;
        state.proposalError = action.payload || 'Failed to generate proposal.';
      })
      
      .addCase(updateProposalThunk.pending, (state) => {
        state.proposalSaving = true;
        state.proposalSaveError = null;
      })

      .addCase(updateProposalThunk.fulfilled, (state, action) => {
        state.proposalSaving = false;
        state.proposalSaveError = null;
        const { jobId, proposal } = action.payload;
        if (!state.proposals) state.proposals = {};
        state.proposals[jobId] = { text: proposal, locked: true };
      })
      
      .addCase(updateProposalThunk.rejected, (state, action) => {
        state.proposalSaving = false;
        state.proposalSaveError = action.payload || 'Failed to save proposal.';
      })
    
    
      
      // When fetching a job, if it has a proposal, set it as locked
      .addCase(fetchJobByIdThunk.fulfilled, (state, action) => {
        const updatedJob = action.payload;
        for (const day of state.jobsByDate) {
          const idx = day.jobs.findIndex(j => String(j.id) === String(updatedJob.id));
          if (idx !== -1) {
            day.jobs[idx] = updatedJob;
            break;
          }
        }
        if (updatedJob.proposal) {
          if (!state.proposals) state.proposals = {};
          state.proposals[updatedJob.id] = { text: updatedJob.proposal, locked: true };
        }
      })

      // .addCase(fetchJobByIdThunk.fulfilled, (state, action) => {
      //   const updatedJob = action.payload;
      //   // Find and update the job in jobsByDate
      //   for (const day of state.jobsByDate) {
      //     const idx = day.jobs.findIndex(j => String(j.id) === String(updatedJob.id));
      //     if (idx !== -1) {
      //       day.jobs[idx] = updatedJob;
      //       break;
      //     }
      //   }
      // })

  .addCase(generateUpworkProposalThunk.pending, (state) => {
  state.upworkProposalLoading = true;
  state.upworkProposalError = null;
})
.addCase(generateUpworkProposalThunk.fulfilled, (state, action) => {
  state.upworkProposalLoading = false;
  state.upworkProposalError = null;
  const { jobId, proposal } = action.payload;
  if (!state.upworkProposals) state.upworkProposals = {};
  state.upworkProposals[jobId] = { text: proposal, locked: false };
})
.addCase(generateUpworkProposalThunk.rejected, (state, action) => {
  state.upworkProposalLoading = false;
  state.upworkProposalError = action.payload || 'Failed to generate proposal.';
})
      
      
.addCase(updateUpworkProposalThunk.pending, (state) => {
  state.upworkProposalSaving = true;
  state.upworkProposalSaveError = null;
})
.addCase(updateUpworkProposalThunk.fulfilled, (state, action) => {
  state.upworkProposalSaving = false;
  state.upworkProposalSaveError = null;
  const { jobId, proposal } = action.payload;
  if (!state.upworkProposals) state.upworkProposals = {};
  if (!state.upworkProposals[jobId]) {
    state.upworkProposals[jobId] = {};
  }
  state.upworkProposals[jobId].text = proposal;
  state.upworkProposals[jobId].locked = true; // Always lock after saving
})
.addCase(updateUpworkProposalThunk.rejected, (state, action) => {
  state.upworkProposalSaving = false;
  state.upworkProposalSaveError = action.payload || 'Failed to save proposal.';
})
      // When fetching a job, if it has a proposal, set it as locked
      .addCase(upworkfetchJobByIdThunk.fulfilled, (state, action) => {
        if (!state.upworkProposals) state.upworkProposals = {};
        const updatedJob = action.payload;
        for (const day of state.upworkJobsByDate) {
          const idx = day.jobs.findIndex(j => String(j.jobId) === String(updatedJob.jobId) || String(j.id) === String(updatedJob.id));
          if (idx !== -1) {
            day.jobs[idx] = updatedJob;
            break;
          }
        }
        if (updatedJob.proposal) {
          state.upworkProposals[updatedJob.jobId || updatedJob.id] = { text: updatedJob.proposal, locked: true };
        }
      })
      //  .addCase( upworkfetchJobByIdThunk.fulfilled, (state, action) => {
      //   const updatedJob = action.payload;
      //   // Find and update the job in upworkJobsByDate
      //   for (const day of state.upworkJobsByDate) {
      //     const idx = day.jobs.findIndex(j => String(j.id) === String(updatedJob.id));
      //     if (idx !== -1) {
      //       day.jobs[idx] = updatedJob;
      //       break;
      //     }
      //   }
      // })


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

.addCase(updateEstimatedBudgetThunk.fulfilled, (state, action) => {
  const { jobId, estimated_budget } = action.payload;
  state.jobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.id) === String(jobId)) {
        job.estimated_budget = estimated_budget;
      }
    });
  });
})

.addCase(updateAePitchedThunk.fulfilled, (state, action) => {
  const { jobId, ae_pitched } = action.payload;
  state.jobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.id) === String(jobId)) {
        job.ae_pitched = ae_pitched;
      }
    });
  });
})
.addCase(updateAeScoreThunk.fulfilled, (state, action) => {
  const { jobId, ae_score, username } = action.payload;
  state.jobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.id) === String(jobId)) {
        job.ae_score = ae_score;
        job.ae_score_user = username; // Optionally store who set it
      }
    });
  });
})

.addCase(updateUpworkAeScoreThunk.fulfilled, (state, action) => {
  const { jobId, ae_score, username } = action.payload;
  state.upworkJobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.jobId) === String(jobId) || String(job.id) === String(jobId)) {
        job.ae_score = ae_score;
        job.ae_score_user = username; // Optionally store who set it
      }
    });
  });
})

.addCase(updateUpworkAePitchedThunk.fulfilled, (state, action) => {
  const { jobId, ae_pitched } = action.payload;
  state.upworkJobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.jobId) === String(jobId) || String(job.id) === String(jobId)) {
        job.ae_pitched = ae_pitched;
      }
    });
  });
})
    
.addCase(updateUpworkEstimatedBudgetThunk.fulfilled, (state, action) => {
  const { jobId, estimated_budget } = action.payload;
  state.upworkJobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.jobId) === String(jobId) || String(job.id) === String(jobId)) {
        job.estimated_budget = estimated_budget;
      }
    });
  });
  
})
.addCase(updateJobStatusNewThunk.fulfilled, (state, action) => {
  const { jobId, status } = action.payload;
  // Update job status in jobsByDate
  state.jobsByDate.forEach(day => {
    day.jobs.forEach(job => {
      if (String(job.id) === String(jobId) || String(job.jobId) === String(jobId)) {
        job.currentStatus = status;
      }
    });
  });
})
.addCase(updateUpworkJobStatusNewThunk.fulfilled, (state, action) => {
  const { jobId, status, job } = action.payload;
  // Update job status in upworkJobsByDate
  state.upworkJobsByDate.forEach(day => {
    day.jobs.forEach(jobItem => {
      if (String(jobItem.jobId) === String(jobId) || String(jobItem.id) === String(jobId)) {
        jobItem.currentStatus = status;
        // Update other fields if they exist in the response
        if (job) {
          jobItem.statusHistory = job.statusHistory || jobItem.statusHistory;
          jobItem.comments = job.comments || jobItem.comments;
          jobItem.proposal = job.proposal || jobItem.proposal;
        }
      }
    });
  });
})

  },
});



export const { resetJobsByDate, setRange , setProposalLoading , setUpworkProposalLoading } = jobsSlice.actions;
export default jobsSlice.reducer; 

