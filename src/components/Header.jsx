import React from "react";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = ({ onLogout, user, onRefreshJobs }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(""); // '', 'fetch', 'filter', 'score'
  const [message, setMessage] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [fetchCooldown, setFetchCooldown] = useState(0); // seconds remaining

  // Check last fetch time on mount
  // useEffect(() => {
  //   const last = localStorage.getItem("lastFetchJobsTime");
  //   if (last) {
  //     setLastFetchTime(Number(last));
  //     updateCooldown(Number(last));
  //   }
  //   const interval = setInterval(() => {
  //     if (last) updateCooldown(Number(last));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // Auto-hide message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Helper to update cooldown
  const updateCooldown = (last) => {
    const now = Date.now();
    const diff = Math.max(0, 24 * 60 * 60 * 1000 - (now - last));
    setFetchCooldown(Math.floor(diff / 1000));
  };

  const handleApiCall = async (type) => {
    let url = "";
    if (type === "fetch") url = "http://localhost:3001/api/apify";
    if (type === "filter") url = "http://localhost:3001/api/apify/filtered";
    if (type === "score") url = "http://localhost:3001/api/apify/score";
    setLoading(type);
    setMessage("");
    try {
      await axios.get(url);
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} jobs: Success!`);
      if (type === "fetch") {
        const now = Date.now();
        localStorage.setItem("lastFetchJobsTime", now.toString());
        setLastFetchTime(now);
        updateCooldown(now);
      }
      if (type === "score" && onRefreshJobs) {
        onRefreshJobs(); // Fetch final jobs after scoring
      }
    } catch (err) {
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} jobs: Failed!`);
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

  return (
    <header className="bg-gradient-to-r from-blue-50 to-white shadow-sm border-b mb-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-2">
        <div className="flex items-center space-x-2">
          {/* Optional: Replace with a logo image if you have one */}
          <span className="text-xl font-extrabold text-blue-600">Job</span>
          <span className="text-xl font-extrabold text-gray-700">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Action buttons moved right before menu */}
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-blue-400 text-blue-700 bg-blue-50 rounded hover:bg-blue-100 hover:text-blue-900 disabled:opacity-50 transition"
              onClick={() => handleApiCall("fetch")}
              disabled={loading || fetchCooldown > 0}
              title={fetchCooldown > 0 ? `You can fetch jobs again in ${formatCooldown(fetchCooldown)}` : ""}
            >
              {loading === "fetch" ? "Fetching..." : "Fetch Jobs"}
            </button>
            {fetchCooldown > 0 && (
              <span className="text-xs text-gray-500">{`Wait ${formatCooldown(fetchCooldown)}`}</span>
            )}
            <button
              className="px-3 py-1 border border-green-400 text-green-700 bg-green-50 rounded hover:bg-green-100 hover:text-green-900 disabled:opacity-50 transition"
              onClick={async () => {
                setLoading("process");
                setMessage("");
                try {
                  await axios.get("http://localhost:3001/api/apify/filtered");
                  setMessage("Filter jobs: Success!");
                  await new Promise(res => setTimeout(res, 2000));
                  await axios.get("http://localhost:3001/api/apify/score");
                  setMessage("Score jobs: Success!");
                  if (onRefreshJobs) onRefreshJobs();
                } catch (err) {
                  setMessage("Process jobs: Failed!");
                } finally {
                  setLoading("");
                }
              }}
              disabled={loading}
            >
              {loading === "process" ? "Processing..." : "Process Jobs"}
            </button>
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
                      className={`w-full text-left px-4 py-2 text-gray-700 ${active ? "bg-gray-100" : ""}`}
                      onClick={() => setShowProfile(true)}
                    >
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 text-gray-700 ${active ? "bg-gray-100" : ""}`}
                      onClick={() => {}}
                    >
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`w-full text-left px-4 py-2 text-red-600 ${active ? "bg-gray-100" : ""}`}
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
                  <div className="mb-1"><span className="font-semibold">Name:</span> {user?.username || user?.name || "Zameer"}</div>
                  <div><span className="font-semibold">Email:</span> {user?.email || "zameer@gmail.com"}</div>
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