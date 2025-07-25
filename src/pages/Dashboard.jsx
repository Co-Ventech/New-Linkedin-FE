import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import JobCard from "../components/JobCard";
import Header from "../components/Header";
import SidebarFilters from "../components/SidebarFilters";
import {
  fetchJobsByDateThunk,
  resetJobsByDate,      
} from "../slices/jobsSlice";
import { logoutUser } from "../api/authApi";

// 1. Define your default filters
const defaultFilters = {
  type: "",
  category: "",
  color: [],
  country: [],
  seniority: "",
  field: [],
  domain: [],
  status: "",
};

// 2. Define static filter options
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { jobsByDate, loading, error, range } = useSelector(
    (state) => state.jobs
  );
  const user = useSelector((state) => state.user.user);

  // 3. Parse filters from URL
  const getFiltersFromUrl = () => {
    const params = queryString.parse(location.search, { arrayFormat: 'bracket' });
    return {
      ...defaultFilters,
      ...params,
      color: params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : [],
      country: params.country ? (Array.isArray(params.country) ? params.country : [params.country]) : [],
      field: params.field ? (Array.isArray(params.field) ? params.field : [params.field]) : [],
      domain: params.domain ? (Array.isArray(params.domain) ? params.domain : [params.domain]) : [],
      // category is single-select here
    };
  };

  const [filters, setFilters] = React.useState(getFiltersFromUrl());
  const [view, setView] = React.useState("grid");

  // 4. Keep filters in sync with URL (for browser navigation)
  useEffect(() => {
    setFilters(getFiltersFromUrl());
    // eslint-disable-next-line
  }, [location.search]);

  // 5. Fetch jobs only if not already loaded or when range changes
  useEffect(() => {
    if (!jobsByDate || jobsByDate.length === 0) {
      dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
    }
  }, [dispatch, range, jobsByDate]);

  const handleJobClick = (job) => {
    navigate(`/jobs/${job.id}`, { state: { job } });
  };

  // 6. Update URL when filters change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

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

  // Flatten all jobs for filter options (for dynamic filters only)
  const allJobs = jobsByDate.flatMap((d) => d.jobs);

  // Filtering logic (apply type, field, country, color, and domain filters)
  const filteredJobsByDate = jobsByDate.map((day) => ({
    jobs: day.jobs.filter((job) => {
      if (filters.type && !(Array.isArray(job.employmentType) ? job.employmentType.includes(filters.type) : job.employmentType === filters.type)) {
        return false;
      }
      if (filters.field.length > 0 && !filters.field.includes(job.title)) {
        return false;
      }
      if (filters.status && job.currentStatus !== filters.status) return false;
      if (filters.domain.length > 0 && !filters.domain.includes(job.predicted_domain)) {
        return false;
      }
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
      const colorValue = job.tier || job.tierColor;
      if (filters.color.length > 0 && !filters.color.includes(colorValue)) {
        return false;
      }
      return true;
    }),
  }));

  // For dynamic filters (categories, fields, domains, countries)
  const categories = Array.from(new Set(allJobs.map((j) => j.seniority).filter(Boolean)));
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
  const domains = Array.from(
    new Set(
      allJobs
        .map((j) => j.predicted_domain)
        .filter(Boolean)
    )
  );
  const handleExport = () => {
    alert("Exporting jobs...");
  };
  const handleLogout = () => {
    logoutUser(dispatch);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header source="linkedin" user={user} onLogout={handleLogout} onExport={handleExport} />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar: visible on desktop only */}
        <aside className="hidden md:block md:w-1/4">
          <SidebarFilters
            categories={categories}
            jobTypes={jobTypes}
            colors={colors}
            countries={countries}
            fields={fields}
            domains={domains}
            filters={filters}
            statusOptions={statusOptions}
            onFilterChange={handleFilterChange}
          />
        </aside>
        {/* Main job list area */}
        <main className="w-full md:w-3/4">
          <div className="flex items-center mb-4 gap-2">
            {/* <label htmlFor="date-range" className="font-semibold">Show jobs from:</label>
            <select
              id="date-range"
              value={range}
              onChange={handleRangeChange}
              className="border rounded px-2 py-1"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select> */}
            <button
              className={`ml-auto px-3 py-1 rounded ${view === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
            <button
              className={`px-3 py-1 rounded ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setView("list")}
            >
              List
            </button>
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
                  <div className={view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                    : "flex flex-col gap-4"}>
                    {day.jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onClick={() => handleJobClick(job)}
                        view={view}
                      />
                    ))}
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