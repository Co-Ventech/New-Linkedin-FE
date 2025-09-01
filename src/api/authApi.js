import { setUser, setCompany } from "../slices/userSlice";


// import dotenv from 'dotenv'; dotenv.config();


const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST
// const PORT = import.meta.env.VITE_PORT 
//api 
const API_BASE = `${REMOTE_HOST}/api`;
console.log(API_BASE);

// Add near top (after imports/constants)
const clearAllAuth = (dispatch) => {
  try {
    if (dispatch) {
      dispatch(setUser(null));
      dispatch(setCompany(null));
    }
  } catch {}
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('authCompany');
  try {
    // brute-force expire all cookies (same-site, path=/ assumed)
    document.cookie.split(';').forEach(c => {
      const name = c.split('=')[0].trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  } catch {}
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  // exp is in seconds
  const nowSec = Math.floor(Date.now() / 1000);
  return decoded.exp <= nowSec;
};

// Validate once on app load; clears and returns false when invalid
export const validateTokenOnLoad = (dispatch) => {
  const token = localStorage.getItem('authToken');
  if (!token || isTokenExpired(token)) {
    clearAllAuth(dispatch);
    return false;
  }
  return true;
};


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


// Exported logout that also clears cookies
export const logoutUser = (dispatch) => {
  clearAllAuth(dispatch);
};