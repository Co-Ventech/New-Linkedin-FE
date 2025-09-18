import React from "react";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { saveJobsToBackend } from "../api/jobService";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, isSuperAdmin, isCompanyAdmin, isCompanyUser } from "../slices/userSlice";

// import dotenv from 'dotenv';
// dotenv.config();

const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const PORT = import.meta.env.VITE_PORT;

const Header = ({ onExport, onLogout, user,source, onRefreshJobs , hideDownloadExcel }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(""); // '', 'fetch', 'filter', 'score'
  const [message, setMessage] = useState("");
  const [fetchCooldown, setFetchCooldown] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  
  // Get user from Redux store
  const currentUser = useSelector(selectUser) || user;
  
  
  // Auto-hide message after 2 seconds
  // useEffect(() => {
  //   if (message) {
  //     const timer = setTimeout(() => setMessage(""), 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [message]);
  // const getCurrentSource = () => (location.pathname.includes("upwork") ? "upwork" : "linkedin");
  // // On mount, check last fetch time from localStorage
  // useEffect(() => {
  //   const source = getCurrentSource();
  //   const last = localStorage.getItem(`lastFetchJobsTime_${source}`);
  //   if (last) {
  //     setLastFetchTime(Number(last));
  //     updateCooldown(Number(last));
  //   }
  //   // Update timer every second
  //   const interval = setInterval(() => {
  //     if (lastFetchTime) updateCooldown(lastFetchTime);
  //   }, 1000);
  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line
  // }, [location.pathname, lastFetchTime]);

  // Helper to update cooldown
  // const updateCooldown = (last) => {
  //   const now = Date.now();
  //   // Restore: 24 hour cooldown (86,400,000 ms)
  //   const diff = Math.max(0, 24 * 60 * 60 * 1000 - (now - last));
  //   setFetchCooldown(Math.floor(diff / 1000));
  // };

  // const handleGoogleSync = async () => {
  //   try {
  //     setLoading(true);
  //     setLoaderText("Scraping jobs from Google...");
  //     await axios.get(`${REMOTE_HOST}/api/google/scrape-jobs`);

  //     // setLoaderText("Cleaning unique jobs...");
  //     // await axios.get("http://localhost:3000/api/google/scrape-jobs-clean");

  //     // setLoaderText("Fetching jobs...");
  //     // await axios.get("http://localhost:3000/api/google/file-jobs");

  //     setLoaderText("Done! Refreshing jobs.");
  //     if (onRefreshJobs) onRefreshJobs(); // Trigger dashboard refresh
  //   } catch (e) {
  //     setLoaderText("Error: " + (e.message || "Fetch failed"));
  //   } finally {
  //     setTimeout(() => {
  //       setLoading(false);
  //       setLoaderText("");
  //     }, 1500);
  //   }
  // };

//  // Somewhere in your header actions area (right side controls), gate the button:
//  {source === 'google' && (
//    <button
//      type="button"
//      onClick={handleGoogleSync}
//      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
//      disabled={loading}
//   >
//      {loading ? loaderText || 'Fetching...' : 'Fetch Google Jobs'}
//    </button>
//  )}

  

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch(`${REMOTE_HOST}/api/linkedin/jobs-by-date/excel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to download file");
      const blob = await response.blob();
      // Create a link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "jobs.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download failed: " + err.message);
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
          {/* Role-based navigation links */}
          {isCompanyAdmin(currentUser) && (
            <button
              onClick={() => navigate("/user-management")}
              className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Manage Users
            </button>
          )}
          
          {isSuperAdmin(currentUser) && (
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Admin Panel
            </button>
          )}
          
        <Menu as="div" className="relative inline-block text-left mr-4">
            <Menu.Button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-100">
              {location.pathname.includes("upwork") ? "Upwork Jobs" : location.pathname.includes("google") ? "Google Jobs" : "LinkedIn Jobs"} ▼
            </Menu.Button>
            <Menu.Items className="absolute left-0 mt-2 w-44 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                      onClick={() => navigate("/dashboard/linkedin")}
                    >
                      LinkedIn Jobs
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                      onClick={() => navigate("/dashboard/upwork")}
                    >
                      Upwork Jobs
                    </button>
                  )}
                </Menu.Item>
              </div>
              
<Menu.Item>
  {({ active }) => (
    <button
      className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
      onClick={() => navigate("/dashboard/google")}
    >
      Google Jobs
    </button>
  )}
</Menu.Item>
            </Menu.Items>
          </Menu> 
          {!hideDownloadExcel &&   (
          <button
        className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        onClick={handleDownloadExcel}
          >
            Download jobs as Excel
          </button>
        )}
          {/* Action buttons moved right before menu */}
          <div className="flex items-center gap-2">
  {location.pathname.includes("upwork" ) || location.pathname.includes("google") ? (
    // Upwork Dashboard Buttons
    <>
      {/* {fetchCooldown === 0 ? (
        <button
          className="px-3 py-1 border border-green-400 text-green-700 bg-green-50 rounded hover:bg-green-100 hover:text-green-900 disabled:opacity-50 transition"
          onClick={handleUpworkFetchJobs}
          disabled={loading}
        >
          {loading === "fetch" ? "Fetching..." : "Fetch Upwork Jobs"}
        </button>
      ) : (
        <span className="text-xs text-gray-500">
          You can fetch jobs again in {formatCooldown(fetchCooldown)}
        </span>
      )} */}
      {/* <button
        className="px-3 py-1 border border-green-600 text-green-700 bg-green-50 rounded hover:bg-green-100 hover:text-green-900 disabled:opacity-50 transition font-semibold"
        onClick={handleUpworkProcessSaveAndFetch}
        disabled={loading}
      >
        {loading === "process-all"
          ? "Processing..."
          : "Process, Save & Show Upwork Jobs"}
      </button> */}
    </>
  ) : (
    // LinkedIn Dashboard Buttons
    <>
      {/* {fetchCooldown === 0 ? (
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
      </button> */}
    </>
  )}
  {/* <button
  className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
  onClick={onExport}
>
  Export
</button> */}
{/* </div> */}
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

      {loading && (
        <div className="mt-2 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span>Fetching Google Jobs...</span>
        </div>
      )}


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
                
                {/* Show Admin link only for super admins */}
                {isSuperAdmin(currentUser) && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 text-gray-700 ${
                          active ? "bg-gray-100" : ""
                        }`}
                        onClick={() => navigate("/admin-dashboard")}
                      >
                        Admin Panel
                      </button>
                    )}
                  </Menu.Item>
                )}
                
                {/* Show User Management link for company admins */}
                {isCompanyAdmin(currentUser) && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`w-full text-left px-4 py-2 text-gray-700 ${
                          active ? "bg-gray-100" : ""
                        }`}
                        onClick={() => navigate("/user-management")}
                      >
                        Manage Users
                      </button>
                    )}
                  </Menu.Item>
                )}
                
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
                  <h2 className="text-lg font-bold mb-2">User Profile</h2>
                  <div className="mb-1">
                    <span className="font-semibold">Name:</span>{" "}
                    {currentUser?.username || currentUser?.name}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Email:</span>{" "}
                    {currentUser?.email}
                  </div>
                  <div className="mb-1">
                    <span className="font-semibold">Role:</span>{" "}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      currentUser?.role === 'super_admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : currentUser?.role === 'company_admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {currentUser?.role === 'super_admin' ? 'Super Admin' : 
                       currentUser?.role === 'company_admin' ? 'Company Admin' : 
                       currentUser?.role === 'company_user' ? 'Company User' : 'User'}
                    </span>
                  </div>
                  {currentUser?.companyId && (
                    <div>
                      <span className="font-semibold">Company ID:</span>{" "}
                      {currentUser.companyId}
                    </div>
                  )}
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
