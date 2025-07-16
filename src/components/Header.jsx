import React from "react";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { saveJobsToBackend } from "../api/jobService";

// import dotenv from 'dotenv';
// dotenv.config();

const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const PORT = import.meta.env.VITE_PORT;

const Header = ({ onLogout, user, onRefreshJobs }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(""); // '', 'fetch', 'filter', 'score'
  const [message, setMessage] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [fetchCooldown, setFetchCooldown] = useState(0); // seconds remaining

  // Auto-hide message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // On mount, check last fetch time from localStorage
  useEffect(() => {
    const last = localStorage.getItem("lastFetchJobsTime");
    if (last) {
      setLastFetchTime(Number(last));
      updateCooldown(Number(last));
    }
    // Update timer every second
    const interval = setInterval(() => {
      if (lastFetchTime) updateCooldown(lastFetchTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastFetchTime]);

  // Helper to update cooldown
  const updateCooldown = (last) => {
    const now = Date.now();
    // Restore: 24 hour cooldown (86,400,000 ms)
    const diff = Math.max(0, 24 * 60 * 60 * 1000 - (now - last));
    setFetchCooldown(Math.floor(diff / 1000));
  };

  // Add this button somewhere in your Header's JSX for testing:

  // Updated Fetch Jobs logic (unchanged)
  const handleFetchJobs = async () => {
    setLoading("fetch");
    setMessage("");
    // Hide button and start timer immediately on click
    const now = Date.now();
    localStorage.setItem("lastFetchJobsTime", now.toString());
    setLastFetchTime(now);
    updateCooldown(now);
    try {
      const fetchRes = await axios.get(`${REMOTE_HOST}:${PORT}/api/apify`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      let jobs = fetchRes.data.jobs;
      if (!jobs) {
        setMessage("No jobs found to save.");
        setLoading("");
        return;
      }
      await saveJobsToBackend(jobs);
      setMessage("About to save jobs to DB...");
      if (onRefreshJobs) onRefreshJobs();
    } catch (err) {
      setMessage("Fetch & Save jobs: Failed!");
    } finally {
      setLoading("");
    }
  };

  // Unified Process, Save, and Fetch handler
  const handleProcessSaveAndFetch = async () => {
    setLoading("process-all");
    setMessage("");
    try {
      // 1. Filter jobs (if needed)
      await axios.get(`${REMOTE_HOST}:${PORT}/api/apify/filtered`);
      setMessage("Filter jobs: Success!");
      // 2. Score jobs
      await axios.get(`${REMOTE_HOST}:${PORT}/api/apify/score`);
      setMessage("Score jobs: Success!");
      // 3. Save jobs to DB
      await axios.post(
        `${REMOTE_HOST}:${PORT}/api/save-jobs`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setMessage("Fetch Jobs from Database: Success!");
      await axios.get(
        `${REMOTE_HOST}:${PORT}/api/jobs-by-date`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setMessage("Fetch Jobs from Database!");
      // 3. Fetch scored jobs from backend file (not jobs-by-date)
      // const scoredRes = await axios.get("http://localhost:3001/api/scored-jobs-file", {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      // });
      // const scoredJobs = scoredRes.data;
      // if (Array.isArray(scoredJobs) && scoredJobs.length > 0) {
      //   // 4. Save scored jobs to DB
      //   await saveJobsToBackend(scoredJobs);
      //   setMessage("Jobs saved to DB!");
      // } else {
      //   setMessage("No scored jobs found to save.");
      // }
      // 5. Fetch jobs by date from DB to refresh UI
      if (onRefreshJobs) onRefreshJobs();
    } catch (err) {
      setMessage("Process/Save/Fetch jobs: Failed!");
    } finally {
      setLoading("");
    }
  };

  // Helper to format cooldown
  const formatCooldown = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Handler to fetch scored jobs from backend file and save to DB
  const handleSaveScoredJobsToDB = async () => {
    setLoading("save-scored");
    setMessage("");
    try {
      alert("About to fetch scored jobs from backend file");
      const res = await fetch(`${REMOTE_HOST}:${PORT}/api/jobs-by-date`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = await res.json();
      console.log(data.job);

      const jobs = data;
      alert(
        "Fetched " + (jobs?.length || 0) + " scored jobs. Now saving to DB..."
      );
      await saveJobsToBackend(jobs);
      alert("Scored jobs saved to DB!");
      setMessage("Scored jobs saved to DB!");
    } catch (err) {
      alert("Failed to save scored jobs: " + err.message);
      setMessage("Failed to save scored jobs: " + err.message);
    } finally {
      setLoading("");
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 to-white shadow-sm border-b mb-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-2">
        <div className="flex items-center space-x-2">
          {/* Optional: Replace with a logo image if you have one */}
          <span className="text-xl font-extrabold text-blue-600">Job</span>
          <span className="text-xl font-extrabold text-gray-700">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Action buttons moved right before menu */}
          <div className="flex items-center gap-2">
            {/* Fetch button only visible if cooldown is 0 */}
            {fetchCooldown === 0 ? (
              <button
                className="px-3 py-1 border border-blue-400 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 hover:text-blue-900 disabled:opacity-50 transition"
                onClick={handleFetchJobs}
                disabled={loading}
              >
                {loading === "fetch" ? "Fetching..." : "Fetch Jobs"}
              </button>
            ) : (
              <span className="text-xs text-gray-500">
                You can fetch jobs again in {formatCooldown(fetchCooldown)}
              </span>
            )}
            <button
              className="px-3 py-1 border border-blue-600 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 hover:text-blue-900 disabled:opacity-50 transition font-semibold"
              onClick={handleProcessSaveAndFetch}
              disabled={loading}
            >
              {loading === "process-all"
                ? "Processing..."
                : "Process, Save & Show Jobs"}
            </button>
            {/* Remove or comment out the other process/fetch/save buttons to avoid confusion */}
            {/*
            <button
              className="px-3 py-1 border border-green-400 text-green-700 bg-green-50 rounded hover:bg-green-100 hover:text-green-900 disabled:opacity-50 transition"
              onClick={handleProcessJobs}
              disabled={loading}
            >
              {loading === "process" ? "Processing..." : "Process Jobs"}
            </button>
            <button
              className="px-3 py-1 border border-purple-400 text-purple-700 bg-purple-50 rounded hover:bg-purple-100 hover:text-purple-900 disabled:opacity-50 transition"
              onClick={async () => {
                alert("Test: About to save dummy jobs");
                try {
                  await saveJobsToBackend(dummyJobs);
                  alert("Test: Dummy jobs saved!");
                  setMessage("Test: Dummy jobs saved!");
                } catch (err) {
                  alert("Test: Failed to save dummy jobs: " + err.message);
                  setMessage("Test: Failed to save dummy jobs: " + err.message);
                }
              }}
            >
              Fetch data from database
            </button>
            <button
              className="px-3 py-1 border border-pink-400 text-pink-700 bg-pink-50 rounded hover:bg-pink-100 hover:text-pink-900 disabled:opacity-50 transition"
              onClick={handleSaveScoredJobsToDB}
              disabled={loading === "save-scored"}
            >
              {loading === "save-scored" ? "Saving..." : "Save Scored Jobs to DB"}
            </button>
            */}
          </div>
          {/* Menu remains at the far right */}
          <Menu as="div" className="relative inline-block text-left ml-4">
            <Menu.Button className="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none">
              <EllipsisVerticalIcon className="w-7 h-7 text-gray-600" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 text-gray-700 ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setShowProfile(true)}
                    >
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 text-gray-700 ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={() => {}}
                    >
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 text-red-600 ${
                        active ? "bg-gray-100" : ""
                      }`}
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
            {/* Profile Popover/Modal */}
            {showProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowProfile(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-bold mb-2">User Profile </h2>
                  <div className="mb-1">
                    <span className="font-semibold">Name:</span>{" "}
                    {user?.username || user?.name || "coventech@coventech.com"}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>{" "}
                    {user?.email || "coventech@coventech.com"}
                  </div>
                </div>
              </div>
            )}
          </Menu>
        </div>
      </div>
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 px-4 py-2 rounded shadow z-50">
          {message}
        </div>
      )}
    </header>
  );
};

export default Header;
