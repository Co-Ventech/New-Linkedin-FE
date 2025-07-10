import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import FilterBar from "../components/FilterBar";
//import DownloadButton from "../components/DownloadButton";
import JobCard from "../components/JobCard";
import { fetchJobs, fetchScoredJobs, loadJobsFromStorage } from "../slices/jobsSlice";
import { logoutUser } from "../api/authApi";
import Header from "../components/Header";
import SidebarFilters from "../components/SidebarFilters";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jobs = useSelector(state => state.jobs.jobs);
  const loading = useSelector(state => state.jobs.loading);
  const error = useSelector(state => state.jobs.error);
  const user = useSelector(state => state.user.user);
  console.log('Redux user object:', user);
  const [filters, setFilters] = React.useState({
    type: "",
    category: "",
    color: [],
    country: [],
    seniority: "",
    field: [],
  });

  useEffect(() => {
    // Try to load jobs from localStorage first
    dispatch(loadJobsFromStorage());
    // If no jobs in localStorage, fetch from API
    setTimeout(() => {
      if (!localStorage.getItem('scoredJobs')) {
        dispatch(fetchScoredJobs());
      }
    }, 0);
  }, [dispatch]);

  const handleJobClick = (job) => {
    navigate(`/jobs/${job.id}`, { state: { job } });
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

  const handleRefreshScoredJobs = () => {
    dispatch(fetchScoredJobs());
  };

  // Filter jobs based on filters (update keys for new structure)
  const filteredJobs = jobs.filter((job) => {
    const typeMatch = !filters.type || (job.employmentType && job.employmentType.includes(filters.type));
    const categoryMatch = !filters.category || (job.seniority === filters.category);
    const colorValue = job.tier || job.tierColor;
    const colorMatch = filters.color.length === 0 || filters.color.includes(colorValue);
    // Extract countries from locations for filtering
    const jobCountries = Array.isArray(job.locations)
      ? job.locations.map(loc => {
          if (typeof loc === 'object' && loc !== null && 'country' in loc) {
            return loc.country;
          }
          if (typeof loc === 'string') {
            const parts = loc.split(',');
            return parts[parts.length - 1]?.trim();
          }
          return null;
        }).filter(Boolean)
      : job.locations
        ? [typeof job.locations === 'object' && job.locations !== null && 'country' in job.locations
            ? job.locations.country
            : typeof job.locations === 'string'
              ? job.locations.split(',').slice(-1)[0]?.trim()
              : null
          ].filter(Boolean)
        : [];
    const countryMatch = filters.country.length === 0 || jobCountries.some(c => filters.country.includes(c));
    const seniorityMatch = !filters.seniority || job.seniority === filters.seniority;
    const fieldMatch = filters.field.length === 0 || filters.field.includes(job.title);
    return typeMatch && categoryMatch && colorMatch && countryMatch && seniorityMatch && fieldMatch;
  });

  // Extract unique job types and categories from jobs
  const jobTypes = Array.from(new Set(jobs.flatMap(j => j.employmentType || []).filter(Boolean)));
  const categories = Array.from(new Set(jobs.map(j => j.seniority).filter(Boolean)));
  const colors = Array.from(new Set(jobs.map(j => j.tier || j.tierColor).filter(Boolean)));

  // Extract unique countries from locations (string-based)
  const countries = Array.from(new Set(
    jobs.flatMap(j => {
      if (Array.isArray(j.locations)) {
        return j.locations.map(loc => {
          if (typeof loc === 'string') {
            const parts = loc.split(',');
            return parts[parts.length - 1]?.trim();
          }
          return null;
        });
      }
      if (typeof j.locations === 'string') {
        const parts = j.locations.split(',');
        return [parts[parts.length - 1]?.trim()];
      }
      return [];
    }).filter(Boolean)
  ));
  console.log('Countries for filter:', countries);
  console.log('Jobs:', jobs);

  // Extract main job fields (first 1-2 words of title, capitalized, deduped)
  const fields = Array.from(new Set(
    jobs.map(j => {
      if (!j.title) return null;
      const words = j.title.split(' ');
      return words.slice(0, 2).join(' ');
    }).filter(Boolean)
  ));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header onLogout={handleLogout} user={user} onRefreshJobs={handleRefreshScoredJobs} />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar: visible on desktop only */}
        <aside className="hidden md:block md:w-1/4">
          <SidebarFilters
            categories={categories}
            jobTypes={jobTypes}
            colors={colors}
            countries={countries}
            fields={fields}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>
        {/* Main job list area */}
        <main className="w-full md:w-3/4">
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
                  <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 

//job title
// job location 
//job description

