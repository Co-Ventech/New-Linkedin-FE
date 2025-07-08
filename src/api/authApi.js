import { setUser } from "../slices/userSlice";

const API_BASE = "http://localhost:3001/api";

export const loginUser = async (dispatch, email, password) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Login failed" };
    }
    const userObj = data.user || data;
    localStorage.setItem("authToken", data.token);
    dispatch(setUser(userObj));
    return { success: true, user: userObj };
  } catch (err) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const registerUser = async (dispatch, username, email, password) => {
  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.message || "Registration failed" };
    }
    const userObj = data.user || data;
    localStorage.setItem("authToken", data.token);
    dispatch(setUser(userObj));
    return { success: true, user: userObj };
  } catch (err) {
    return { success: false, error: "Network error. Please try again." };
  }
};

export const logoutUser = (dispatch) => {
  dispatch(setUser(null));
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}; 