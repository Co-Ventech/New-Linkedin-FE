import { createSlice } from '@reduxjs/toolkit';

const initialUser = JSON.parse(localStorage.getItem('authUser')) || null;

const userSlice = createSlice({
  name: 'user',  
  initialState: {
    user: initialUser,
    company: JSON.parse(localStorage.getItem('authCompany')) || null,
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
});

export const { setUser, setCompany, updateUserProfile } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.user;
export const selectCompany = (state) => state.user.company;
export const selectUserRole = (state) => state.user.user?.role;
export const selectCompanyId = (state) => state.user.user?.companyId;

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