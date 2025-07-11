import { createSlice } from '@reduxjs/toolkit';

const initialUser = JSON.parse(localStorage.getItem('authUser')) || null;

const userSlice = createSlice({
  name: 'user',  
  initialState: {
    user: initialUser,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('authUser', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('authUser');
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer; 