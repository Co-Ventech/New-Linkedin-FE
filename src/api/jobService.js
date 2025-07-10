// Placeholder API service for jobs

import axios from "axios";

// Old API and its logic removed. Only new API endpoints are used now.

// If getJobs and getJobById are not used, you can remove them. If still imported elsewhere, make them throw:
export async function getJobs() {
  throw new Error("getJobs is deprecated. Use the new API endpoints via the header buttons.");
}

export async function getJobById(id) {
  throw new Error("getJobById is deprecated. Use the new API endpoints via the header buttons.");
}

export async function getScoredJobs() {
  try {
    const res = await axios.get("http://localhost:3001/api/apify/scored");
    return res.data || [];
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch scored jobs."
    );
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