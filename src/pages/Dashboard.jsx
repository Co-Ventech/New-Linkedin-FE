import React, { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import JobCard from "../components/JobCard";
import Header from "../components/Header";
import SidebarFilters from "../components/SidebarFilters";
import {
  fetchJobsByDateThunk,
  resetJobsByDate,
  setRange,
} from "../slices/jobsSlice";
import { logoutUser } from "../api/authApi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobsByDate, loading, error, range } = useSelector(
    (state) => state.jobs
  );
  const user = useSelector((state) => state.user.user);
  const [filters, setFilters] = React.useState({
    type: "",
    category: "",
    color: [],
    country: [],
    seniority: "",
    field: [],
  });

  // Fetch jobs on mount and when range changes
  useEffect(() => {
    dispatch(resetJobsByDate());
    dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 })); // fetch all at once
  }, [dispatch, range]);

  const handleJobClick = (job) => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Dropdown for date range
  const handleRangeChange = (e) => {
    dispatch(setRange(e.target.value));
  };

  // Flatten all jobs for filter options
  const allJobs = jobsByDate.flatMap((d) => d.jobs);

  // Filtering logic (apply type, field, country, and color filters)
  const filteredJobsByDate = jobsByDate.map((day) => ({
    date: day.date,
    jobs: day.jobs.filter((job) => {
      // Job type filter
      if (filters.type && !(Array.isArray(job.employmentType) ? job.employmentType.includes(filters.type) : job.employmentType === filters.type)) {
        return false;
      }
      // Field filter
      if (filters.field.length > 0 && !filters.field.includes(job.title)) {
        return false;
      }
      // Country filter
      if (filters.country.length > 0) {
        let jobCountries = [];
        if (Array.isArray(job.locations)) {
          jobCountries = job.locations.map((loc) => {
            if (typeof loc === "string") {
              const parts = loc.split(",");
              return parts[parts.length - 1]?.trim();
            }
            if (typeof loc === "object" && loc !== null && "country" in loc) {
              return loc.country;
            }
            return null;
          }).filter(Boolean);
        } else if (typeof job.locations === "string") {
          const parts = job.locations.split(",");
          jobCountries = [parts[parts.length - 1]?.trim()];
        }
        if (!jobCountries.some((c) => filters.country.includes(c))) {
          return false;
        }
      }
      // Color filter
      const colorValue = job.tier || job.tierColor;
      if (filters.color.length > 0 && !filters.color.includes(colorValue)) {
        return false;
      }
      return true;
    }),
  }));

  console.log('jobsByDate', jobsByDate);
  console.log('filteredJobsByDate', filteredJobsByDate);

  // Extract unique job types, categories, colors, countries, fields
  const jobTypes = Array.from(new Set(allJobs.flatMap((j) => j.employmentType || []).filter(Boolean)));
  const categories = Array.from(new Set(allJobs.map((j) => j.seniority).filter(Boolean)));
  const colors = Array.from(new Set(allJobs.map((j) => j.tier || j.tierColor).filter(Boolean)));
  const countries = Array.from(
    new Set(
      allJobs
        .flatMap((j) => {
          if (Array.isArray(j.locations)) {
            return j.locations.map((loc) => {
              if (typeof loc === "string") {
                const parts = loc.split(",");
                return parts[parts.length - 1]?.trim();
              }
              return null;
            });
          }
          if (typeof j.locations === "string") {
            const parts = j.locations.split(",");
            return [parts[parts.length - 1]?.trim()];
          }
          return [];
        })
        .filter(Boolean)
    )
  );
  const fields = Array.from(
    new Set(
      allJobs
        .map((j) => j.title)
        .filter(Boolean)
    )
  );

  // Add logout handler
  const handleLogout = () => {
    logoutUser(dispatch);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header user={user} onLogout={handleLogout} />
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
          <div className="flex items-center mb-4 gap-2">
            <label htmlFor="date-range" className="font-semibold">Show jobs from:</label>
            <select
              id="date-range"
              value={range}
              onChange={handleRangeChange}
              className="border rounded px-2 py-1"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
          {loading ? (
            <div className="text-center text-gray-500">Loading jobs...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            filteredJobsByDate.length === 0 || filteredJobsByDate.every((d) => d.jobs.length === 0) ? (
              <div className="col-span-full text-center text-gray-500">No jobs found.</div>
            ) : (
              filteredJobsByDate.map((day) => (
                <section key={day.date} className="mb-8">
                  <h2 className="text-lg font-bold mb-2">{day.date}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {day.jobs.map((job) => {
                      console.log('Job passed to JobCard:', job);
                      return (
                        <JobCard
                          key={job.id}
                          job={job}
                          onClick={() => handleJobClick(job)}
                        />
                      );
                    })}
                  </div>
                </section>
              ))
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

