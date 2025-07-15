// src/api/updateJobStatus.js
import axios from "axios";

const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const PORT = import.meta.env.VITE_PORT;
const API_BASE = `${REMOTE_HOST}:${PORT}/api`;

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PATCH for status only
export async function updateJobStatus(jobId, status) {
  try {
    const payload = { status };
    console.log("PATCH URL (status):", `${API_BASE}/jobs/${jobId}`);
    console.log("PATCH DATA (status):", payload);
    const res = await axios.patch(
      `${API_BASE}/jobs/${jobId}`,
      payload,
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to update job status."
    );
  }
}

// PATCH for comment only
export async function addJobComment(jobId, comment) {
  try {
    const payload = { comment };
    console.log("PATCH URL (comment):", `${API_BASE}/jobs/${jobId}`);
    console.log("PATCH DATA (comment):", payload);
    const res = await axios.patch(
      `${API_BASE}/jobs/${jobId}`,
      payload,
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to add comment."
    );
  }
}
