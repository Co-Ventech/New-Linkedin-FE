import React, { useEffect, useState } from "react";
import SidebarFilters from "../components/SidebarFilters";
import UpworkJobCard from "../components/UpworkJobCard";
import Header from "../components/Header";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchUpworkJobsByDateThunk } from "../slices/jobsSlice";


const UpworkDashboard = () => {
  const dispatch = useDispatch();
  const { upworkJobsByDate, loading, error } = useSelector(state => state.jobs);
  const [filters, setFilters] = React.useState({
    level: "",
    country: [],
    category: [],
    jobType: "",
    paymentVerified: "",
    clientHistory: "",
    projectLength: "",

  });

  React.useEffect(() => {
    if (!upworkJobsByDate || upworkJobsByDate.length === 0) {
      dispatch(fetchUpworkJobsByDateThunk());
    }
  }, [dispatch, upworkJobsByDate]);

  // Flatten jobs for filtering
  const allJobs = upworkJobsByDate.flatMap(day => day.jobs || []);

  // Extract unique filter options from jobs
  const levels = Array.from(new Set(allJobs.map(j => j.level).filter(Boolean)));
  const countries = Array.from(new Set(allJobs.map(j => j.country).filter(Boolean)));
  const categories = Array.from(new Set(allJobs.map(j => j.category).filter(Boolean)));
  const jobTypes = Array.from(new Set(allJobs.map(j => j.jobType).filter(Boolean)));
  const paymentVerified = Array.from(new Set(allJobs.map(j => j.isPaymentMethodVerified).filter(v => v !== undefined)));
  const clientHistory = Array.from(new Set(allJobs.map(j => j.buyerTotalJobsWithHires).filter(v => v !== undefined)));
  const hourlyWeeks = Array.from(new Set(allJobs.map(j => j.hourlyWeeks).filter(v => v !== undefined)));
  // Filtering logic
  const filteredJobs = allJobs.filter(job => {
    if (filters.level && job.level !== filters.level) return false;
    if (filters.country.length > 0 && !filters.country.includes(job.country)) return false;
    if (filters.category.length > 0 && !filters.category.includes(job.category)) return false;
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    if (filters.paymentVerified !== "" && String(job.isPaymentMethodVerified) !== filters.paymentVerified) return false;
  if (filters.clientHistory) {
    const hires = job.buyerTotalJobsWithHires;
    if (filters.clientHistory === "no_hires" && (hires !== null && hires !== undefined && hires > 0)) return false;
    if (filters.clientHistory === "1_9" && (!hires || hires < 1 || hires > 9)) return false;
    if (filters.clientHistory === "10_plus" && (!hires || hires < 10)) return false;
  }
  if (filters.projectLength) {
    const weeks = job.hourlyWeeks;
    let group = "";
    if (weeks === null || weeks === undefined) {
      group = "less_than_1";
    } else if (weeks < 4) {
      group = "less_than_1";
    } else if (weeks >= 4 && weeks < 13) {
      group = "1_3";
    } else if (weeks >= 13 && weeks < 25) {
      group = "3_6";
    } else if (weeks >= 25) {
      group = "more_6";
    }
    if (filters.projectLength !== group) return false;
  }
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
            paymentVerified={paymentVerified}
            clientHistory={filters.clientHistory}
            // onFilterChange={handleFilterChange}
            jobTypes={jobTypes}
            levels={levels}
            countries={countries}
            categories={categories}
            filters={filters}
            projectLength={filters.projectLength}
            onFilterChange={handleFilterChange}
          />
        </aside>
        {/* Main job list area */}
        <main className="w-full md:w-3/4">
          {/* <h1 className="text-2xl font-bold mb-4">Upwork Jobs</h1> */}
          {loading ? (
            <div>Loading jobs...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filteredJobs.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredJobs.map(job => (
                <UpworkJobCard key={job.jobId || job.id} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UpworkDashboard;