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
// export async function updateJobStatus(jobId, status) {
//   try {
//     const payload = { status };
//     console.log("PATCH URL (status):", `${API_BASE}/jobs/${jobId}`);
//     console.log("PATCH DATA (status):", payload);
//     const res = await axios.patch(
//       `${API_BASE}/jobs/${jobId}`,
//       payload,
//       { headers: getAuthHeaders() }
//     );
//     return res.data;
//   } catch (err) {
//     throw new Error(
//       err.response?.data?.message || err.message || "Failed to update job status."
//     );
//   }
// }

export async function updateJobStatus(jobId, { status, username }) {
  try {
    const url = `${API_BASE}/jobs/${jobId}`;
    console.log("PATCH URL (status):", url);
    console.log("PATCH DATA (status):", { status, username });
    const res = await axios.patch(
      url,
      { status, username },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("API updateJobStatus error:", err, err.response?.data);
    throw new Error(
      err.response?.data?.message || err.message || "Failed to update job status."
    );
  }
}

// PATCH for comment only
export async function addJobComment(jobId, { username, comment }) {
  try {
    const payload = { username, comment };
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

export async function updateAeComment(jobId, ae_comment) {
  try {
    const url = `${API_BASE}/jobs/${jobId}`;
    const payload = { ae_comment }; 
    console.log("PATCH URL (ae_comment):", url);
    console.log("PATCH DATA (ae_comment):", payload);
    const res = await axios.patch(
      url,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("API updateAeComment error:", err, err.response?.data);
    throw new Error(
      err.response?.data?.message || err.message || "Failed to update AE comment."
    );
  }
}

// export async function updateUpworkJobStatus(jobId, { status, username }) {
  // const url = `${API_BASE}/upwork/job/${jobId}`;
  // ...same as before, but with Upwork endpoint...

export async function updateUpworkJobStatus(jobId, { status, username }) {
  try {
    const url = `${API_BASE}/upwork/job/${jobId}`;
    const payload = { status, username };
    console.log("PATCH URL (status):", url);
    console.log("PATCH DATA (status):", { status, username });
    const res = await axios.patch(
      url,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("API updateJobStatus error:", err, err?.response, err?.response?.data);
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to update job status."
    );
  }
}
// export async function updateUpworkAeComment(jobId, ae_comment) {
//   const url = `${API_BASE}/upwork/job/${jobId}`;
  // ...same as before, but with Upwork endpoint...

  export async function updateUpworkAeComment(jobId, ae_comment) {
    try {
      const url = `${API_BASE}/upwork/job/${jobId}`;
      const payload = { ae_comment }; 
      console.log("PATCH URL (ae_comment):", url);
      console.log("PATCH DATA (ae_comment):", payload);
      const res = await axios.patch(
        url,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("API addUpworkJobComment error:", err, err?.response, err?.response?.data);
      throw new Error(
        err?.response?.data?.message || err?.message || "Failed to add comment."
      );
    }
  }
// export async function addUpworkJobComment(jobId, { username, comment }) {
//   const url = `${API_BASE}/upwork/job/${jobId}`;
//   // ...same as before, but with Upwork endpoint...
export async function addUpworkJobComment(jobId, { username, comment }) {
  // console.log("jobId",localJob?.jobId,localJob);
  try {
    const url = `${API_BASE}/upwork/job/${jobId}`;
    const payload = { username, comment };
    console.log("PATCH URL (comment):", url);
    console.log("PATCH DATA (comment):", payload);
    const res = await axios.patch(
      url,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }catch (err) {
    console.error("API addUpworkJobComment error:", err, err?.response, err?.response?.data);
    throw new Error(
      err?.response?.data?.message || err?.message || "Failed to add Aecomment."
    );
  }
}