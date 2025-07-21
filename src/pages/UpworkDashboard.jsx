import React, { useEffect, useState } from "react";
import SidebarFilters from "../components/SidebarFilters";
import UpworkJobCard from "../components/UpworkJobCard";
import Header from "../components/Header";
import axios from "axios";

const UpworkDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    level: "",
    country: [],
    category: [],
    jobType: "",
  });

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("http://44.214.92.17:3000/api/upwork/jobs-by-date", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setJobs(res.data.jobs || []);
    };
    fetchJobs();
  }, []);

  // Extract unique filter options from jobs
  const levels = Array.from(new Set(jobs.map(j => j.level).filter(Boolean)));
  const countries = Array.from(new Set(jobs.map(j => j.country).filter(Boolean)));
  const categories = Array.from(new Set(jobs.map(j => j.category).filter(Boolean)));
  const jobTypes = Array.from(new Set(jobs.map(j => j.jobType).filter(Boolean)));

  // Filtering logic
  const filteredJobs = jobs.filter(job => {
    if (filters.level && job.level !== filters.level) return false;
    if (filters.country.length > 0 && !filters.country.includes(job.country)) return false;
    if (filters.category.length > 0 && !filters.category.includes(job.category)) return false;
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    return true;
  });

  const handleExport = () => {
    alert("Exporting jobs...");
  };
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header source="upwork" onExport={handleExport} />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-1/4">
          <SidebarFilters
            jobTypes={jobTypes}
            levels={levels}
            countries={countries}
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>
        {/* Main job list area */}
        <main className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold mb-4">Upwork Jobs</h1>
          {filteredJobs.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredJobs.map(job => (
                <UpworkJobCard key={job.jobId} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UpworkDashboard;