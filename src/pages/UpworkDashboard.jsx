import React, { useEffect, useState } from "react";
import SidebarFilters from "../components/SidebarFilters";
import UpworkJobCard from "../components/UpworkJobCard";
import Header from "../components/Header";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchUpworkJobsByDateThunk } from "../slices/jobsSlice";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";

const defaultFilters = { 
  level: "",
  country: [],
  category: [],
  jobType: "",
  paymentVerified: "",
  clientHistory: "",
  projectLength: "",
  status: "",
  hoursPerWeek: "",
  jobDuration: "",
  color: [],
};

  const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance"];
  const colors = ["Yellow", "Green", "Red"];

  const statusOptions = [
    "not_engaged",
    "applied",
    "engaged",
    "interview",
    "offer",
    "rejected",
    "archived"
  ];

const UpworkDashboard = () => {
  const dispatch = useDispatch();
  const { upworkJobsByDate, loading, error } = useSelector(state => state.jobs);
  

  // const [filters, setFilters] = React.useState({
  //   level: "",
  //   country: [],
  //   category: [],
  //   jobType: "",
  //   color : [],
  //   paymentVerified: "",
  //   clientHistory: "",
  //   projectLength: "",
  //   hoursPerWeek: "",
  //   jobDuration: "",
  //   status: "",

  // });

  
const location = useLocation();
const navigate = useNavigate();

  // 2. Parse filters from URL
  const getFiltersFromUrl = () => {
    const params = queryString.parse(location.search, { arrayFormat: 'bracket' });
    return {
      ...defaultFilters,
      ...params,
      // Ensure multi-selects are always arrays
      country: params.country ? (Array.isArray(params.country) ? params.country : [params.country]) : [],
      category: params.category ? (Array.isArray(params.category) ? params.category : [params.category]) : [],
      color: params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : [],
    };
  };

  const [filters, setFilters] = React.useState(getFiltersFromUrl());

  
  // 3. Keep filters in sync with URL (for browser navigation)
  useEffect(() => {
    setFilters(getFiltersFromUrl());
    // eslint-disable-next-line
  }, [location.search]);

  // 4. Fetch jobs on mount
  useEffect(() => {
    if (!upworkJobsByDate || upworkJobsByDate.length === 0) {
      dispatch(fetchUpworkJobsByDateThunk());
    }
  }, [dispatch, upworkJobsByDate]);


  // React.useEffect(() => {
  //   if (!upworkJobsByDate || upworkJobsByDate.length === 0) {
  //     dispatch(fetchUpworkJobsByDateThunk());
  //   }
  // }, [dispatch, upworkJobsByDate]);

  // Flatten jobs for filtering
  const allJobs = upworkJobsByDate.flatMap(day => day.jobs || []);

  const levels = Array.from(new Set(allJobs.map(j => j.level).filter(Boolean)));
  const countries = Array.from(new Set(allJobs.map(j => j.country).filter(Boolean)));
  const categories = Array.from(new Set(allJobs.map(j => j.category).filter(Boolean)));
  const paymentVerified = [true, false]; // static for sidebar
  const clientHistory = [1, 10, 100]; // static for sidebar
  const projectLength = [1, 3, 6, 13, 25]; // static for sidebar
  const hoursPerWeek = [30, 40, 50]; // static for sidebar
  const jobDuration = ["contract_to_hire", "not_given"]; // static for sidebar
  const statusOptions = ["not_engaged", "applied", "engaged", "interview", "offer", "rejected", "archived"]; // static for sidebar
  const colors = ["Yellow", "Green", "Red"]; // static for sidebar

  // Filtering logic
  const filteredJobs = allJobs.filter(job => {
    if (filters.level && job.level !== filters.level) return false;
    if (filters.country.length > 0 && !filters.country.includes(job.country)) return false;
    if (filters.category.length > 0 && !filters.category.includes(job.category)) return false;
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    if (filters.status && job.currentStatus !== filters.status) return false;
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
  if (filters.hoursPerWeek) {
    const minHours = job.minHoursWeek;
    let group = "";
    if (minHours === null || minHours === undefined) {
      group = "not_given";
    } else if (minHours <= 30) {
      group = "less_30";
    } else if (minHours > 30) {
      group = "more_30";
    }
    if (filters.hoursPerWeek !== group) return false;
  }

  // Job Duration filter
  if (filters.jobDuration) {
    const isContractToHire = job.isContractToHire;
    let group = "";
    if (isContractToHire === true) {
      group = "contract_to_hire";
    } else {
      group = "not_given";
    }
    if (filters.jobDuration !== group) return false;
  }
    // Color filter
    const colorValue = job.tier || job.tierColor;
    if (filters.color.length > 0 && !filters.color.includes(colorValue)) {
      return false;
    }
    return true;
  });

  const handleExport = () => {
    alert("Exporting jobs...");
  };
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Remove empty filters for cleanliness
    const filtersForUrl = { ...newFilters };
    Object.keys(filtersForUrl).forEach(k => {
      if (
        filtersForUrl[k] === "" ||
        (Array.isArray(filtersForUrl[k]) && filtersForUrl[k].length === 0)
      ) {
        delete filtersForUrl[k];
      }
    });

    const query = queryString.stringify(filtersForUrl, { arrayFormat: 'bracket' });
    navigate(`?${query}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header source="upwork" onExport={handleExport} hideDownloadExcel />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-1/4">
          <SidebarFilters
            paymentVerified={paymentVerified}
            clientHistory={clientHistory} // pass static options, not value
            jobTypes={jobTypes}
            levels={levels}
            countries={countries}
            categories={categories}
            filters={filters}
            projectLength={projectLength}
            hoursPerWeek={hoursPerWeek}
            jobDuration={jobDuration}
            statusOptions={statusOptions}
            colors={colors}
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