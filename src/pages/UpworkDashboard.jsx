import React, { useEffect, useState } from "react";
import SidebarFilters from "../components/SidebarFilters";
import UpworkJobCard from "../components/UpworkJobCard";
import Header from "../components/Header";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchUpworkJobsByDateThunk } from "../slices/jobsSlice";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchUpworkJobsByDateRange } from "../api/jobService";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateUpworkJobStatusThunk } from "../slices/jobsSlice";

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
  color: []
};


  // const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance"];
  const upworkJobTypeOptions = [
    { value: "", label: "All" },
    { value: "FIXED", label: "Fixed" },
    { value: "HOURLY", label: "Hourly" },
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

const UpworkDashboard = () => {
  const dispatch = useDispatch();
  const { upworkJobsByDate, loading, error } = useSelector(state => state.jobs);
  const [dateRange, setDateRange] = useState("1d");
  const [filteredJobsByDate, setFilteredJobsByDate] = useState([]);
  const [loadingRange, setLoadingRange] = useState(false);

  const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];
  const [kanbanView, setKanbanView] = useState(false);
  const [kanbanUser, setKanbanUser] = useState("");
  const [kanbanUserError, setKanbanUserError] = useState("");
  const [kanbanJobs, setKanbanJobs] = useState({});
  const [kanbanLoading, setKanbanLoading] = useState(false);
  const [kanbanError, setKanbanError] = useState(null);
  
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
      // // color: params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : [],
      // color: typeof params.color === "string" ? params.color : "",
      color: Array.isArray(params.color) ? params.color[0] : (params.color || ""),
      type: params.type ? (Array.isArray(params.type) ? params.type : [params.type]) : [],
    };
  };

  const [filters, setFilters] = React.useState(getFiltersFromUrl());

  useEffect(() => {
    if (!kanbanView) return;
    const jobs = upworkJobsByDate.flatMap(day => day.jobs || []);
    const grouped = {};
    statusOrder.forEach(status => {
      grouped[status] = jobs.filter(job => job.currentStatus === status);
    });
    setKanbanJobs(grouped);
  }, [upworkJobsByDate, kanbanView]);
  
  // 3. Keep filters in sync with URL (for browser navigation)
  useEffect(() => {
    setFilters(getFiltersFromUrl());
    // eslint-disable-next-line
  }, [location.search]);

  // 4. Fetch jobs on mount
  useEffect(() => {
    if (!upworkJobsByDate || upworkJobsByDate.length === 0 || upworkJobsByDate.every(day => !day.jobs || day.jobs.length === 0)) {
      dispatch(fetchUpworkJobsByDateThunk());
    }
  }, [dispatch, upworkJobsByDate]);

 // Fetch jobs when dateRange changes
 useEffect(() => {
  const fetchJobs = async () => {
    setLoadingRange(true);
    try {
      const startdate = getStartDate(dateRange);
      const enddate = getEndDate();
      const data = await fetchUpworkJobsByDateRange(startdate, enddate);
      setFilteredJobsByDate(data);
    } catch (err) {
      setFilteredJobsByDate([]);
    } finally {
      setLoadingRange(false);
    }
  };
  fetchJobs();
}, [dateRange]);



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
  const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance"];

  // Filtering logic
  const filteredJobs = allJobs.filter(job => {
    if (filters.level && job.level !== filters.level) return false;
    if (filters.country.length > 0 && !filters.country.includes(job.country)) return false;
    if (filters.category.length > 0 && !filters.category.includes(job.category)) return false;
    // if (filters.jobType && job.jobType !== filters.jobType) return false;
    // if (filters.jobType && job.jobType !== filters.jobType) return false;
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
      if (filters.color && filters.color !== "" && colorValue !== filters.color) {
        return false;
      }
    return true;
  });

  
    // Dropdown handler
    const handleDateRangeChange = (e) => {
      setDateRange(e.target.value);
    };

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
    if (filtersForUrl.color && Array.isArray(filtersForUrl.color)) {
      filtersForUrl.color = filtersForUrl.color[0];
    }

    const query = queryString.stringify(filtersForUrl, { arrayFormat: 'bracket' });
    navigate(`?${query}`, { replace: true });
  };


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

  // Optimistic UI update
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
    await dispatch(updateUpworkJobStatusThunk({
      jobId: job.jobId || job.id,
      status: destStatus,
      username: kanbanUser,
    })).unwrap();

    // Optionally: refetch jobs or update Redux state if needed
  } catch (err) {
    setKanbanJobs(kanbanJobs); // revert
    setKanbanError("Failed to update job status. Please try again.");
  } finally {
    setKanbanLoading(false);
  }
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
            jobTypeOptions={upworkJobTypeOptions}
            jobTypeLabel="Job Type"
            // filters={filters}
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
    Kanban View
  </button>
  {kanbanView && (
    <>
      <label className="font-semibold ml-4">Select User:</label>
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
    </>
  )}
</div>
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
                        key={job.jobId || job.id}
                        draggableId={(job.jobId || job.id).toString()}
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
  loadingRange ? (
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
  )
)}          </main>
      </div>
    </div>
  );
};

export default UpworkDashboard;