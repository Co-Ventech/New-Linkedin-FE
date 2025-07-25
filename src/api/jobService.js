// src/api/jobService.js

import axios from "axios";
// import dotenv from 'dotenv'; dotenv.config();


const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST
const PORT = import.meta.env.VITE_PORT 
//api 
const API_BASE = `${REMOTE_HOST}:${PORT}/api`;



function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function saveJobsToBackend(jobs) {
  try {
    console.log("[saveJobsToBackend] Sending jobs to backend:", jobs);
    const res = await axios.post(
      `${REMOTE_HOST}:${PORT}/api/save-jobs`,
      jobs,
      { headers: getAuthHeaders() }
    );
    console.log("[saveJobsToBackend] Response from backend:", res.data);
    return res.data;
  } catch (err) {
    console.error("[saveJobsToBackend] Error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || err.message || "Failed to save jobs to backend."
    );
  }
}

export async function fetchJobsByDate(range = "7d", page = 1, limit = 20) {
   try {
     const res = await axios.get(
       `${REMOTE_HOST}:${PORT}/api/jobs-by-date`,
       { headers: getAuthHeaders() }
     );
     const data = res.data || [];
     // Patch: if the response is a single object, wrap it in an array
     if (data && !Array.isArray(data) && data.date && data.jobs) {
       return [data];
     }
     return data;
   } catch (err) {
     throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch jobs by date."
     );
   }
 }
 export async function fetchJobById(jobId) {
  try {
    const url = `${REMOTE_HOST}:${PORT}/api/apify/job?id=${jobId}`;
    const res = await axios.get(url, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch job by ID."
    );
  }
}
