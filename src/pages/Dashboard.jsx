import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import JobCard from "../components/JobCard";
import Header from "../components/Header";
import SidebarFilters from "../components/SidebarFilters";
import { fetchlinkedinJobsByDateRange } from "../api/jobService";
// import { fetchLinkedInJobsByDateThunk } from "../slices/jobsSlice";
// import FilterBar from "../components/FilterBar"; // adjust path as needed
// import JobsList from "../components/JobsList"; 
import {
  fetchJobsByDateThunk,
  resetJobsByDate,setRange,
  updateJobStatusThunk
} from "../slices/jobsSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { logoutUser } from "../api/authApi";

const statusLabels = {
  not_engaged: "Not Engaged",
  applied: "Applied",
  engaged: "Engaged",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  archived: "Archived",
};

const statusOrder = [
  "not_engaged",
  "applied",
  "engaged",
  "interview",
  "offer",
  "rejected",
  "archived",
];

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
const linkedInJobTypeOptions = [
  { value: "", label: "All" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];
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


const dateRanges = [
  { label: "Last 24 Hours", value: "1d" },
  { label: "Last 3 Days", value: "3d" },
  { label: "Last 7 Days", value: "7d" },
];

function getStartDate(range) {
  const today = new Date();
  let start = new Date(today);
  if (range === "1d") start.setDate(today.getDate() - 1);
  if (range === "3d") start.setDate(today.getDate() - 3);
  if (range === "7d") start.setDate(today.getDate() - 7);
  return start.toISOString().slice(0, 10);
}

function getEndDate() {
  const today = new Date();
  return today.toISOString().slice(0, 10);
}
const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];

// // Helper to get start/end based on filter
// const getDateRangeForFilter = (filter) => {
//   const end = new Date();
//   let start = new Date();
//   switch (filter) {
//     case "24hours":
//       start.setDate(end.getDate() - 1);
//       break;
//     case "7days":
//       start.setDate(end.getDate() - 7);
//       break;
//     case "30days":
//       start.setDate(end.getDate() - 30);
//       break;
//     default:
//       start.setDate(end.getDate() - 1);
//   }
//   return {
//     start: start.toISOString().split("T")[0],
//     end: end.toISOString().split("T")[0],
//   };
// };

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //const selectedFilter = useSelector(state => state.jobs.selectedFilter);
  //const jobs = useSelector(state => state.jobs.jobsByFilter[selectedFilter] || []);
  // const selectedFilter = useSelector((state) => state.jobs.selectedFilter);
  // const jobsByFilter = useSelector((state) => state.jobs.jobsByFilter);
  // const jobs = jobsByFilter[selectedFilter] || [];
  // const loading = useSelector((state) => state.jobs.loading);
  const [kanbanView, setKanbanView] = useState(false);
const [kanbanJobs, setKanbanJobs] = useState({});
const [kanbanLoading, setKanbanLoading] = useState(false);
const [kanbanError, setKanbanError] = useState(null);
const [kanbanUser, setKanbanUser] = useState("");
const [kanbanUserError, setKanbanUserError] = useState("");
 
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
      // color: params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : [],\
      color: Array.isArray(params.color) ? params.color[0] : (params.color || ""),
      country: params.country ? (Array.isArray(params.country) ? params.country : [params.country]) : [],
      field: params.field ? (Array.isArray(params.field) ? params.field : [params.field]) : [],
      domain: params.domain ? (Array.isArray(params.domain) ? params.domain : [params.domain]) : [],
      // category is single-select here
    };
  };

  const [filters, setFilters] = React.useState(getFiltersFromUrl());
  const [view, setView] = React.useState("grid");

  
  const [dateRange, setDateRange] = useState(range);
  // const [filteredJobByDate, setFilteredJobByDate] = useState([]);
  // const [loadingRange, setLoadingRange] = useState(false);
  // Fetch jobs when dateRange changes
  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     setLoadingRange(true);
  //     try {
  //       const startdate = getStartDate(dateRange);
  //       const enddate = getEndDate();
  //       const data = await fetchlinkedinJobsByDateRange(startdate, enddate);
  //       setFilteredJobByDate(data);
  //     } catch (err) {
  //       setFilteredJobByDate([]);
  //     } finally {
  //       setLoadingRange(false);
  //     }
  //   };
  //   fetchJobs();
  // }, [dateRange]);

  // Group jobs by status for Kanban
useEffect(() => {
  if (!kanbanView) return;
  // Flatten and filter jobs as needed
  const jobs = jobsByDate.flatMap(day => day.jobs);
  const grouped = {};
  statusOrder.forEach(status => {
    grouped[status] = jobs.filter(job => job.currentStatus === status);
  });
  setKanbanJobs(grouped);
}, [jobsByDate, kanbanView]);

// Handle drag end
const onDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    return;
  }

  if (!kanbanUser) {
    setKanbanUserError("Please select a user before changing status.");
    return;
  }

  const sourceStatus = source.droppableId;
  const destStatus = destination.droppableId;
  const job = kanbanJobs[sourceStatus][source.index];
  if (!job) return;

  // Optimistically update UI
  const newKanbanJobs = { ...kanbanJobs };
  newKanbanJobs[sourceStatus] = Array.from(newKanbanJobs[sourceStatus]);
  newKanbanJobs[sourceStatus].splice(source.index, 1);
  newKanbanJobs[destStatus] = Array.from(newKanbanJobs[destStatus]);
  const updatedJob = { ...job, currentStatus: destStatus };
  newKanbanJobs[destStatus].splice(destination.index, 0, updatedJob);
  setKanbanJobs(newKanbanJobs);

  setKanbanLoading(true);
  setKanbanError(null);
  try {
    // Use the Redux thunk, not the direct API!
    await dispatch(updateJobStatusThunk({
      jobId: job.id,
      status: destStatus,
      username: kanbanUser,
    })).unwrap();
    await dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
    // Optionally: refetch jobs or update Redux state if needed
  } catch (err) {
    setKanbanJobs(kanbanJobs); // revert
    setKanbanError("Failed to update job status. Please try again.");
  } finally {
    setKanbanLoading(false);
  }
};


  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    dispatch(setRange(e.target.value));
    dispatch(fetchJobsByDateThunk({ range: e.target.value, page: 1, limit: 1000 }));
  };
  
    // Update local storage when jobsByDate changes
    useEffect(() => {
      localStorage.setItem("jobsByDate", JSON.stringify(jobsByDate));
    }, [jobsByDate]);
  // 4. Keep filters in sync with URL (for browser navigation)
  useEffect(() => {
    setFilters(getFiltersFromUrl());
    // eslint-disable-next-line
  }, [location.search]);

  // 5. Fetch jobs only if not already loaded or when range changes
  useEffect(() => {
    if (!jobsByDate || jobsByDate.length === 0 || jobsByDate.every(day => !day.jobs || day.jobs.length ===0 )) {
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
    if (filtersForUrl.color && Array.isArray(filtersForUrl.color)) {
  filtersForUrl.color = filtersForUrl.color[0];
}

    const query = queryString.stringify(filtersForUrl, { arrayFormat: 'bracket' });
    navigate(`?${query}`, { replace: true });
  };
// Keep filters in sync with URL
useEffect(() => {
  setFilters(getFiltersFromUrl());
  // eslint-disable-next-line
}, [location.search]);

  // Flatten all jobs for filter options (for dynamic filters only)
  const allJobs = jobsByDate.flatMap((d) => d.jobs);

  // Filtering logic (apply type, field, country, color, and domain filters)
  const filteredJobsByDate = jobsByDate.map((day) => ({
    date:day.date,
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
      if (filters.color && filters.color !== "" && colorValue !== filters.color) {
        return false;
      }
      if (filters.jobType && job.employmentType !== filters.jobType) return false;
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

  
  // // Dropdown handler
  // const handleDateRangeChange = (e) => {
  //   setDateRange(e.target.value);
  // };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Header source="linkedin" user={user} onLogout={handleLogout} onExport={handleExport} />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar: visible on desktop only */}
        <aside className="hidden md:block md:w-1/4">
          <SidebarFilters
            categories={categories}
            jobTypeOptions={linkedInJobTypeOptions}
            jobTypeLabel="Employment Type"
            filters={filters}
            colors={colors}
            countries={countries}
            fields={fields}
            domains={domains}
            // filters={filters}
            statusOptions={statusOptions}
            onFilterChange={handleFilterChange}
          />
        </aside>
        {/* Main job list area */}
        <main className="w-full md:w-3/4">
        <div className="flex items-center mb-4">
            <label htmlFor="date-range" className="mr-2 font-semibold">Show jobs from:</label>
            <select
              id="date-range"
              value={dateRange}
              onChange={handleDateRangeChange}
              className="border rounded px-2 py-1"
            >
              {dateRanges.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {/* {loadingRange ? (
            <div>Loading jobs...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : filteredJobsByDate.length === 0 ? (
            <div>No jobs found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredJobsByDate.map(job => (
                <JobCard key={job.jobId || job.id} job={job} />
              ))}
            </div>
          )} */}
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
           {/* <div className="flex items-center mb-4 gap-2"> */}
           <div className="flex items-center mb-4 gap-2">
  <button
    className={`px-3 py-1 rounded ${!kanbanView ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={() => setKanbanView(false)}
  >
    List/Grid View
  </button>
  <button
    className={`px-3 py-1 rounded ${kanbanView ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={() => setKanbanView(true)}
  >
    Pipeline View
  </button>
  <button
    className={`ml-auto px-3 py-1 rounded ${view === "grid" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={() => setView("grid")}
    disabled={kanbanView}
  >
    Grid
  </button>
  <button
    className={`px-3 py-1 rounded ${view === "list" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={() => setView("list")}
    disabled={kanbanView}
  >
    List
  </button>
</div>

          </div>
          {kanbanView && (
  <div className="mb-4 flex items-center gap-2">
    <label className="font-semibold">Select User for Status Change:</label>
    <select
      className="border rounded px-2 py-1"
      value={kanbanUser}
      onChange={e => {
        setKanbanUser(e.target.value);
        setKanbanUserError("");
      }}
    >
      <option value="">-- Select User --</option>
      {USER_LIST.map(user => (
        <option key={user} value={user}>{user}</option>
      ))}
    </select>
    {kanbanUserError && (
      <span className="text-red-500 text-sm ml-2">{kanbanUserError}</span>
    )}
  </div>
)}
          {kanbanView ? (
  // --- KANBAN VIEW ---
  <div className="overflow-x-auto pb-4">
    {kanbanError && (
      <div className="text-red-500 mb-2">{kanbanError}</div>
    )}
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 min-w-[1200px]">
        {statusOrder.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-white rounded-lg shadow flex-1 min-w-[250px] max-w-[300px] flex flex-col
                  ${snapshot.isDraggingOver ? "bg-blue-50" : ""}
                `}
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <div className="p-3 border-b font-bold text-center sticky top-0 bg-white z-10">
                  {statusLabels[status]}
                </div>
                <div className="p-2 flex-1">
                  {kanbanJobs[status] && kanbanJobs[status].length === 0 && (
                    <div className="text-gray-400 text-center py-4">No jobs</div>
                  )}
                  {kanbanJobs[status] &&
                    kanbanJobs[status].map((job, idx) => (
                      <Draggable
                        key={job.id}
                        draggableId={job.id.toString()}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white rounded shadow mb-3 p-3 cursor-pointer transition
                              ${snapshot.isDragging ? "ring-2 ring-blue-400" : ""}
                              hover:shadow-lg
                            `}
                            onClick={() => handleJobClick(job)}
                          >
                            <div className="font-semibold">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.company || job.companyName}</div>
                            <div className="mt-1 text-xs text-blue-600">{statusLabels[job.currentStatus]}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
    {kanbanLoading && (
      <div className="fixed left-0 right-0 bottom-0 bg-blue-100 text-blue-700 text-center py-2 z-50">
        Updating status...
      </div>
    )}
  </div>
) : (
  // --- LIST/GRID VIEW ---
  loading ? (
    <div>Loading jobs...</div>
  ) : error ? (
    <div className="text-red-500">{error}</div>
  ) : filteredJobsByDate.length === 0 ? (
    <div>No jobs found.</div>
  ) : (
    filteredJobsByDate.map((day) => (
      <section key={day.date} className="mb-8">
        {/* <h2 className="text-lg font-bold mb-2">{day.date}</h2> */}
        <div className={view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
          : "flex flex-col gap-4"}>
          {Array.isArray(day.jobs) && day.jobs.length > 0 ? (
            day.jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => handleJobClick(job)}
                view={view}
              />
            ))
          ) : (
            <div className="col-span-full text-gray-500">No jobs for this date.</div>
          )}
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