// src/api/jobService.js

import axios from "axios";
// import dotenv from 'dotenv'; dotenv.config();


const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST
// const PORT = import.meta.env.VITE_PORT 
//api 
const API_BASE = `${REMOTE_HOST}/api`;



function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function saveJobsToBackend(jobs) {
  try {
    console.log("[saveJobsToBackend] Sending jobs to backend:", jobs);
    const res = await axios.post(
      `${REMOTE_HOST}/api/linkedin/save-jobs`,
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

export async function fetchJobsByDate(range = '1d', page = 1, limit = 10) {
  try {
    const today = new Date();
    const endDate = today.toISOString().slice(0, 10);

    let url = `${REMOTE_HOST}/api/linkedin/jobs-by-date?page=${page}&limit=${limit}`;

    if (range === '3d' || range === '7d') {
      const days = range === '3d' ? 3 : 7;
      const start = new Date(today);
      start.setDate(today.getDate() - (days - 1));
      const startDate = start.toISOString().slice(0, 10);
      url += `&start=${startDate}&end=${endDate}`;
    }
    // range === '1d' (Last Batch): no start/end params

    const res = await axios.get(url, { headers: getAuthHeaders() });
    const data = res.data || [];
    // If API returns a single object {date, jobs}, wrap it as an array to match UI expectations
    if (data && !Array.isArray(data) && data.date && data.jobs) {
      return [data];
    }
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch jobs by date.");
  }
}
 export async function fetchJobById(jobId) {
  try {
    const url = `${REMOTE_HOST}/api/linkedin/job?id=${jobId}`;
    const res = await axios.get(url, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch job by ID."
    );
  }
}

 export async function upworkfetchJobById(jobId) {
  try {
    const url = `${REMOTE_HOST}/api/upwork/job?id=${jobId}`;
    const res = await axios.get(url, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch job by ID."
    );
  }
}

// export async function fetchUpworkJobsByDateRange(start, end) {
//   try {
//     const url = `${REMOTE_HOST}/api/upwork/jobs-by-date?start=${start}&end=${end}`;
//     const res = await axios.get(url, { headers: getAuthHeaders() });
//     return res.data; // Should be [{date, jobs: [...]}, ...]
//   } catch (err) {
//     throw new Error(
//       err.response?.data?.message || err.message || "Failed to fetch jobs by date range."
//     );
//   }
// }


// export async function fetchlinkedinJobsByDateRange(start, end) {
//   try {
//     const url = `${REMOTE_HOST}/api/linkedin/jobs-by-date?start=${start}&end=${end}`;
//     const res = await axios.get(url, { headers: getAuthHeaders() });
//     return res.data; // Should be [{date, jobs: [...]}, ...]
//   } catch (err) {
//     throw new Error(
//       err.response?.data?.message || err.message || "Failed to fetch jobs by date range."
//     );
//   }
// }


// export async function fetchLinkedinJobsPaginated({ range, page = 1, limit = 10 }) {
//   const today = new Date();
//   const endDate = today.toISOString().slice(0, 10);

//   let url = `${REMOTE_HOST}/api/linkedin/jobs-by-date?page=${page}&limit=${limit}`;
//   if (range === "last24h") {
//     // No extra params, just latest batch
//   } else if (range === "last3d" || range === "last7d") {
//     const days = range === "last3d" ? 3 : 7;
//     const start = new Date(today);
//     start.setDate(today.getDate() - (days - 1));
//     const startDate = start.toISOString().slice(0, 10);
//     url += `&start=${startDate}&end=${endDate}`;
//   }
//   // You can add a "date" param if you want to support single date selection

//   const res = await axios.get(url, { headers: getAuthHeaders() });
//   // API returns { date, jobs: [...] }
//   return res.data.jobs || [];
// }

