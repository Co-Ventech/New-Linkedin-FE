import { setUser, setCompany } from "../slices/userSlice";
// import dotenv from 'dotenv'; dotenv.config();


const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST
// const PORT = import.meta.env.VITE_PORT 
//api 
const API_BASE = `${REMOTE_HOST}/api`;
console.log(API_BASE);

export const loginUser = async (dispatch, emailOrUsername, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Login failed" };
    }
    
    const userObj = data.user || data;
    localStorage.setItem("authToken", data.token);
    
    // Set user and company info
    dispatch(setUser(userObj));
    if (data.company) {
      dispatch(setCompany(data.company));
    }
    
    return { success: true, user: userObj, company: data.company };
  } catch (err) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const companySignup = async (companyData) => {
  try {
    const res = await fetch(`${API_BASE}/auth/company-signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Company registration failed" };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Password reset request failed" };
    }
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Password reset failed" };
    }
    return { success: true, message: data.message };
  } catch (err) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const logoutUser = (dispatch) => {
  dispatch(setUser(null));
  dispatch(setCompany(null));
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  localStorage.removeItem("authCompany");
}; 