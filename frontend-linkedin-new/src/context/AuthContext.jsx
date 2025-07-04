import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/userSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);

  // Fix: Change port from 3000 to 3001
  const API_BASE = "http://localhost:3001/api";

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

      // Store token
      localStorage.setItem("authToken", data.token);
      
      // Fetch user data from dashboard endpoint
      await fetchUserData(data.token);
      
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (username, email, password) => { // Changed name to username
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }), // Use username
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, error: data.message || "Registration failed" };
      }

      // Store token
      localStorage.setItem("authToken", data.token);
      
      // Fetch user data
      await fetchUserData(data.token);
      
      return { success: true };
    } catch (err) {
      console.error("Register error:", err);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  // New function to fetch user data
  const fetchUserData = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      
      if (res.ok && data.user) {
        const userData = {
          id: data.user._id,
          username: data.user.username,
          email: data.user.email
        };
        dispatch(setUser(userData));
        localStorage.setItem("authUser", JSON.stringify(userData));
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  // Check for existing token on app load
  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    
    if (token && savedUser) {
      try {
        dispatch(setUser(JSON.parse(savedUser)));
        // Verify token is still valid
        await fetchUserData(token);
      } catch (err) {
        // Token invalid, clear auth
        logout();
      }
    }
  };

  const logout = () => {
    dispatch(setUser(null));
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
