// Placeholder API service for jobs

import axios from "axios";

const API_URL = "http://192.168.100.120:3000/api/jobs/search";

export async function getJobs(token) {
  try {
    const res = await axios.post(API_URL, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.data.data.jobs || [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch jobs."
    );
  }
}

export async function getJobById(id, token) {
  try {
    const jobs = await getJobs(token);
    return jobs.find(j => j.id === id) || null;
  } catch (err) {
    throw err;
  }
}

export async function getCategories() {
  // TODO: Implement API call
  return [];
}

export async function downloadJobsExcel(filters) {
  // TODO: Implement API call
}

export async function getJobDetails(id) {
  // TODO: Implement API call
  return null;
} 