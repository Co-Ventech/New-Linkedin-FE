// Placeholder API service for jobs

import axios from "axios";

// New API endpoint for real jobs
const API_URL = "http://192.168.43.167:8000/api/v1/get-csv-jobs";

// Fetch jobs from the new API
export async function getJobs() {
  try {
    const res = await axios.get(API_URL);
    // The API returns an array of jobs with the new structure
    return res.data || [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch jobs."
    );
  }
}

// Get a job by Job ID from the fetched jobs
export async function getJobById(id) {
  try {
    const jobs = await getJobs();
    return jobs.find(j => j["Job ID"] === id) || null;
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