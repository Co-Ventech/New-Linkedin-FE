import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { companyPipelineAPI } from '../services/api';



const initialUser = JSON.parse(localStorage.getItem('authUser')) || null;

export const fetchCompanyPipelineThunk = createAsyncThunk(
  'user/fetchCompanyPipeline',
  async (_, { rejectWithValue }) => {
    try {
      const data = await companyPipelineAPI.get();
      console.log('fetchCompanyPipelineThunk', data);
      return data?.pipeline || null;
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to load pipeline');
    }
  }
);

export const updateCompanyPipelineThunk = createAsyncThunk(
  'user/updateCompanyPipeline',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await companyPipelineAPI.update(payload);
      return data?.pipeline || null;
    } catch (e) {
      return rejectWithValue(e.message || 'Failed to update pipeline');
    }
  }
);

const defaultStages = ['not_engaged','applied','engaged','interview','offer','rejected','onboard'];

const userSlice = createSlice({
  name: 'user',  
  initialState: {
    user: initialUser,
    company: JSON.parse(localStorage.getItem('authCompany')) || null,
    pipeline: null,
    pipelineLoading: false,
    pipelineError: null
  },
  reducers: {

    setUser(state, action) {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('authUser', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authCompany');
        state.company = null;
      }
    },
    setCompany(state, action) {
      state.company = action.payload;
      if (action.payload) {
        localStorage.setItem('authCompany', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('authCompany');
      }
    },
    updateUserProfile(state, action) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('authUser', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyPipelineThunk.pending, (state) => {
        state.pipelineLoading = true; state.pipelineError = null;
      })
      .addCase(fetchCompanyPipelineThunk.fulfilled, (state, action) => {
        state.pipelineLoading = false;
        state.pipeline = action.payload;
      })
      .addCase(fetchCompanyPipelineThunk.rejected, (state, action) => {
        state.pipelineLoading = false; state.pipelineError = action.payload;
      })
      .addCase(updateCompanyPipelineThunk.fulfilled, (state, action) => {
        state.pipeline = action.payload;
      });
  }
});

export const { setUser, setCompany, updateUserProfile } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectCompany = (state) => state.user.company;
export const selectUserRole = (state) => state.user.user?.role;
export const selectCompanyId = (state) => state.user.user?.companyId;
export const selectPipeline = (state) => state.user.pipeline;
export const selectStatusOptions = (state) =>
  (state.user.pipeline?.statusStages?.length
    ? state.user.pipeline.statusStages
        .slice()
        .sort((a,b) => (a.sortOrder||0) - (b.sortOrder||0))
        .map(s => s.name)
    : defaultStages);

// Role helper functions
export const isSuperAdmin = (user) => user?.role === 'super_admin';
export const isCompanyAdmin = (user) => user?.role === 'company_admin';
export const isCompanyUser = (user) => user?.role === 'company_user';
export const isAdmin = (user) => isSuperAdmin(user) || isCompanyAdmin(user);


// Check if user has permission to access a specific company
export const canAccessCompany = (user, companyId) => {
  if (!user || !companyId) return false;
  if (isSuperAdmin(user)) return true;
  return user.companyId === companyId;
};


export default userSlice.reducer; 