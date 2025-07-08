import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FilterBar from "../components/FilterBar";
//import DownloadButton from "../components/DownloadButton";
import JobCard from "../components/JobCard";
import { fetchJobs } from "../slices/jobsSlice";
import { logoutUser } from "../api/authApi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector(state => state.jobs.jobs);
  const loading = useSelector(state => state.jobs.loading);
  const error = useSelector(state => state.jobs.error);
  const user = useSelector(state => state.user.user);
  const [filters, setFilters] = React.useState({ type: "", category: "" });

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleJobClick = (job) => {
    navigate(`/jobs/${job["Job ID"]}`, { state: { job } });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // const handleDownload = () => {
  //   alert("Download Excel triggered!");
  //};

  const handleLogout = () => {
    logoutUser(dispatch);
    navigate("/login");
  };

  // Filter jobs based on filters (update keys for new structure)
  const filteredJobs = jobs.filter((job) => {
    const typeMatch = !filters.type || (job["Employment Type"] && job["Employment Type"].includes(filters.type));
    const categoryMatch = !filters.category || (job["Seniority Level"] === filters.category);
    return typeMatch && categoryMatch;
  });

  // Extract unique job types and categories from jobs
  const jobTypes = Array.from(new Set(jobs.flatMap(j => j["Employment Type"] || []).filter(Boolean)));
  const categories = Array.from(new Set(jobs.map(j => j["Seniority Level"]).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
         <div className="text-lg font-semibold text-gray-700"></div>
          {/* <div className="text-lg font-semibold text-gray-700">Welcome, {user?.username || user?.email || "User"}!</div> */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <FilterBar
            categories={categories}
            jobTypes={jobTypes}
            onFilterChange={handleFilterChange}
            //<DownloadButton onClick={handleDownload} />
          />
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading jobs...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No jobs found.</div>
            ) : (
              filteredJobs.map((job) => (
                <JobCard key={job["Job ID"]} job={job} onClick={() => handleJobClick(job)} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 

//job title
// job location 
//job description

