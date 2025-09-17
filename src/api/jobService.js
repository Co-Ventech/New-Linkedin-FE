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
export async function fetchGoogleFileJobs() {
  try {
    const url = `${API_BASE}/google/file-jobs`;
    const res = await axios.get(url, { headers: getAuthHeaders() });

    // Extract the jobs array from the response
    const data = res.data || {};
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];

    // Normalize the jobs with additional fields
    return jobs.map((job) => ({
      ...job,
      _platform: 'google', // Add platform identifier
      _id: job.primary_hash || job.secondary_hash || job.job_id || job.share_link || String(Math.random()), // Generate a stable ID
      _dateKey: (job.scraped_at || job.posted_time || new Date().toISOString()).slice(0, 10), // Extract or generate a date key
    }));
  } catch (err) {
    console.error("[fetchGoogleFileJobs] Error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch Google file jobs.");
  }
}

export async function fetchJobsByDate(range = '1d', page = 1, limit = 10, platform) {
  try {
    const url = `${REMOTE_HOST}/api/company-jobs/user-jobs`;
    
    const res = await axios.get(url, { 
      params: { page, limit, ...(platform ? { platform } : {}) },
      headers: getAuthHeaders() 
    });
    
    const data = res.data || {};
    
    if (data.jobs && Array.isArray(data.jobs)) {
      const jobsByDate = {};
      
      data.jobs.forEach(job => {
        const jobDate = job.ts_publish || job.createdAt || job.distributedAt || new Date().toISOString();
        const dateKey = jobDate.slice(0, 10);
        if (!jobsByDate[dateKey]) {
          jobsByDate[dateKey] = [];
        }
        jobsByDate[dateKey].push(job);
      });
      
      const result = Object.entries(jobsByDate).map(([date, jobs]) => ({
        date,
        jobs
      }));
      
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      return result;
    }
    
    return [];
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch jobs by date.");
  }
}

// ===== Admin / Company / User management & analytics APIs =====

// Super admin: trigger scraping
export async function scrapeJobs({ keywords, platform, start, end }) {
  const res = await axios.post(
    `${API_BASE}/jobs/scrape`,
    { keywords, platform, start, end },
    { headers: getAuthHeaders() }
  );
  return res.data;
}

// Super admin: list scrape batches
export async function fetchJobBatches() {
  const res = await axios.get(`${API_BASE}/jobs/batches`, { headers: getAuthHeaders() });
  return res.data;
}

// Super admin: distribute jobs to companies
export async function distributeJobs({ batchId, companyIds, strategy }) {
  const res = await axios.post(
    `${API_BASE}/jobs/distribute`,
    { batchId, companyIds, strategy },
    { headers: getAuthHeaders() }
  );
  return res.data;
}

// Companies CRUD
export async function fetchCompanies() {
  const res = await axios.get(`${API_BASE}/companies`, { headers: getAuthHeaders() });
  return res.data;
}

export async function createCompany(payload) {
  const res = await axios.post(`${API_BASE}/companies`, payload, { headers: getAuthHeaders() });
  return res.data;
}

export async function updateCompany(companyId, payload) {
  const res = await axios.put(`${API_BASE}/companies/${companyId}`, payload, { headers: getAuthHeaders() });
  return res.data;
}

export async function deleteCompany(companyId) {
  const res = await axios.delete(`${API_BASE}/companies/${companyId}`, { headers: getAuthHeaders() });
  return res.data;
}

// Analytics
export async function fetchGlobalAnalytics() {
  const res = await axios.get(`${API_BASE}/analytics/global`, { headers: getAuthHeaders() });
  return res.data;
}

export async function fetchCompanyAnalytics(companyId) {
  const res = await axios.get(`${API_BASE}/analytics/company/${companyId}` , { headers: getAuthHeaders() });
  return res.data;
}

export async function fetchUserAnalytics(userId) {
  const res = await axios.get(`${API_BASE}/analytics/user/${userId}` , { headers: getAuthHeaders() });
  return res.data;
}

// Company admin: jobs and users
export async function fetchCompanyJobs(companyId, { page = 1, limit = 20 } = {}) {
  const res = await axios.get(`${API_BASE}/jobs/company/${companyId}`, {
    params: { page, limit },
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function fetchCompanyUsers(companyId) {
  const res = await axios.get(`${API_BASE}/users/company/${companyId}`, { headers: getAuthHeaders() });
  return res.data;
}

export async function assignJobs({ jobIds, userId }) {
  const res = await axios.post(`${API_BASE}/jobs/assign`, { jobIds, userId }, { headers: getAuthHeaders() });
  return res.data;
}

export async function bulkUpdateJobs(payload) {
  const res = await axios.put(`${API_BASE}/jobs/bulk-update`, payload, { headers: getAuthHeaders() });
  return res.data;
}

// User: assigned jobs and profile
export async function fetchUserJobs(userId, { page = 1, limit = 20 } = {}) {
  const res = await axios.get(`${API_BASE}/jobs/user/${userId}`, {
    params: { page, limit },
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function updateUserProfileApi(userId, payload) {
  const res = await axios.put(`${API_BASE}/users/${userId}`, payload, { headers: getAuthHeaders() });
  return res.data;
}

// Generic job interactions
export async function updateJobStatusGeneric(jobId, status) {
  const res = await axios.put(`${API_BASE}/jobs/${jobId}/status`, { status }, { headers: getAuthHeaders() });
  return res.data;
}

export async function addJobCommentGeneric(jobId, { comment }) {
  const res = await axios.post(`${API_BASE}/jobs/${jobId}/comments`, { comment }, { headers: getAuthHeaders() });
  return res.data;
}

export async function addJobProposalGeneric(jobId, { proposal }) {
  const res = await axios.post(`${API_BASE}/jobs/${jobId}/proposal`, { proposal }, { headers: getAuthHeaders() });
  return res.data;
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

