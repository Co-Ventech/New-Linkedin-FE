import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FilterBar from "../components/FilterBar";
import DownloadButton from "../components/DownloadButton";
import JobCard from "../components/JobCard";
import { loadDummyJobs } from "../slices/jobsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector(state => state.jobs.jobs);
  const user = useSelector(state => state.user.user);
  const [filters, setFilters] = React.useState({ type: "", category: "" });

  useEffect(() => {
    dispatch(loadDummyJobs());
  }, [dispatch]);

  const handleJobClick = (job) => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = () => {
    alert("Download Excel triggered!");
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate("/login");
  };

  // Filter jobs based on filters
  const filteredJobs = jobs.filter((job) => {
    const typeMatch = !filters.type || (job.employment_type && job.employment_type.includes(filters.type));
    const categoryMatch = !filters.category || (job.seniority === filters.category);
    return typeMatch && categoryMatch;
  });

  // Extract unique job types and categories from jobs
  const jobTypes = Array.from(new Set(jobs.flatMap(j => j.employment_type || []).filter(Boolean)));
  const categories = Array.from(new Set(jobs.map(j => j.seniority).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-semibold text-gray-700">Welcome, {user?.name || user?.email}</div>
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
          />
          <DownloadButton onClick={handleDownload} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No jobs found.</div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 

//job title
// job location 
//job description

