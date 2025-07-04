import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/userSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  // Backend endpoints
  const API_BASE = "http://192.168.100.69:3000/api/v1";

  const login = async (email, password) => {
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
      // Store token and user info
      localStorage.setItem("authToken", data.token);
      dispatch(setUser({ name: data.user?.name, email: data.user?.email }));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || "Registration failed" };
      }
      // Store token and user info
      localStorage.setItem("authToken", data.token);
      dispatch(setUser({ name: data.user?.name, email: data.user?.email }));
      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 