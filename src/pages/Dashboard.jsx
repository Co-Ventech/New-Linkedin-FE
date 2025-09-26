
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import JobCard from "../components/JobCard";
import Header from "../components/Header";
import SidebarFilters from "../components/SidebarFilters";
import {selectStatusOptions, selectPipeline} from "../slices/userSlice";
import { fetchCompanyPipelineThunk } from "../slices/userSlice";
import {
  fetchJobsByDateThunk,
  resetJobsByDate,
  setRange,
  updateJobStatusThunk,
  updateUpworkJobStatusNewThunk,
  updateJobStatusNewThunk

} from "../slices/jobsSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { logoutUser } from "../api/authApi";
import { Calendar, Grid3X3, List, Kanban, Users, AlertCircle, Briefcase, Building2, Filter, Download, Search, ChevronDown, Eye, BarChart3 } from 'lucide-react';

// Colors for known default stages; unknown stages get neutral styling
const KNOWN_COLORS = {
  not_engaged: { dotColor: "bg-gray-400", headerColor: "bg-gray-100", textColor: "text-gray-700", borderColor: "border-gray-200", color: "bg-gray-50" },
  applied:     { dotColor: "bg-blue-400", headerColor: "bg-blue-100", textColor: "text-blue-700", borderColor: "border-blue-200", color: "bg-blue-50" },
  engaged:     { dotColor: "bg-indigo-400", headerColor: "bg-indigo-100", textColor: "text-indigo-700", borderColor: "border-indigo-200", color: "bg-indigo-50" },
  interview:   { dotColor: "bg-purple-400", headerColor: "bg-purple-100", textColor: "text-purple-700", borderColor: "border-purple-200", color: "bg-purple-50" },
  offer:       { dotColor: "bg-emerald-400", headerColor: "bg-emerald-100", textColor: "text-emerald-700", borderColor: "border-emerald-200", color: "bg-emerald-50" },
  rejected:    { dotColor: "bg-red-400", headerColor: "bg-red-100", textColor: "text-red-700", borderColor: "border-red-200", color: "bg-red-50" },
  onboard:     { dotColor: "bg-teal-400", headerColor: "bg-teal-100", textColor: "text-teal-700", borderColor: "border-teal-200", color: "bg-teal-50" },
};
const NEUTRAL = { dotColor: "bg-slate-400", headerColor: "bg-slate-100", textColor: "text-slate-700", borderColor: "border-slate-200", color: "bg-slate-50" };

// Default filters remain the same
const defaultFilters = {
  category: [],
  color: "",
  country: [],
  seniority: "",
  field: [],
  domain: [],
  status: "",
  jobType:"",
};

// Static filter options remain the same
const linkedInJobTypeOptions = [
  { value: "", label: "All" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const colors = ["Yellow", "Green", "Red"];
// const statusOptions = [
//   "not_engaged",
//   "applied",
//   "engaged",
//   "interview",
//   "offer",
//   "rejected",
//   "onboard"
// ];


const timeRanges = [
  { value: 'last24h', label: 'Last Batch (Last 24 Hours)' },
  { value: 'last3d', label: 'Last 3 Days' },
  { value: 'last7d', label: 'Last 7 Days' },
];

const dateRanges = [
  { label: "Last 24 Hours", value: "1d" },
  { label: "Last 3 Days", value: "3d" },
  { label: "Last 7 Days", value: "7d" },
];

// function getStartDate(range) {
//   const today = new Date();
//   let start = new Date(today);
//   if (range === "1d") start.setDate(today.getDate() - 1);
//   if (range === "3d") start.setDate(today.getDate() - 3);
//   if (range === "7d") start.setDate(today.getDate() - 7);
//   return start.toISOString().slice(0, 10);
// }

// function getEndDate() {
//   const today = new Date();
//   return today.toISOString().slice(0, 10);
// }

const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [kanbanView, setKanbanView] = useState(false);
  const [kanbanJobs, setKanbanJobs] = useState({});
  const [kanbanLoading, setKanbanLoading] = useState(false);
  const [kanbanError, setKanbanError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Set());
  const statusOptions = useSelector(selectStatusOptions) || [];
  const pipeline = useSelector(selectPipeline);
  // const authInitializing = useSelector(selectAuthInitializing);
  const pipelineLoading = useSelector((state) => state.user.pipelineLoading);
  const [pipelineRequested, setPipelineRequested] = useState(false);
  const [failedUpdates, setFailedUpdates] = useState(new Map());
// const [page, setPage] = useState(1);

  const {hasMore, jobsByDate, loading, error, range } = useSelector(
    (state) => state.jobs
  );
  // Ensure pipeline is loaded (initial loader)
  useEffect(() => {
    if (!pipelineRequested && statusOptions.length === 0) {
      setPipelineRequested(true);
      dispatch(fetchCompanyPipelineThunk());
    }
  }, [dispatch, statusOptions.length, pipelineRequested]);
  useEffect(() => {
    dispatch(fetchCompanyPipelineThunk())

  }, [])

  const DEFAULT_STAGES = [
    { name: "not_engaged", displayName: "Not Engaged", sortOrder: 0 },
    { name: "applied", displayName: "Applied", sortOrder: 1 },
    { name: "engaged", displayName: "Engaged", sortOrder: 2 },
    { name: "interview", displayName: "Interview", sortOrder: 3 },
    { name: "offer", displayName: "Offer", sortOrder: 4 },
    { name: "rejected", displayName: "Rejected", sortOrder: 5 },
    { name: "onboard", displayName: "Onboard", sortOrder: 6 },
  ];

  const stages = (pipeline?.statusStages?.length
    ? [...pipeline.statusStages].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : DEFAULT_STAGES
  );

  const statusOrder = stages.map(s => s.name);
  const statusLabels = stages.reduce((acc, s) => { acc[s.name] = s.displayName || s.name; return acc; }, {});
  const statusConfig = statusOrder.reduce((acc, name) => { const base = KNOWN_COLORS[name] || NEUTRAL; acc[name] = { label: statusLabels[name] || name, ...base }; return acc; }, {});

  const user = useSelector((state) => state.user.user);

  // Parse filters from URL (logic remains the same)
  const getFiltersFromUrl = () => {
    const params = queryString.parse(location.search, { arrayFormat: 'bracket' });
    return {
      ...defaultFilters,
      ...params,
      color: Array.isArray(params.color) ? params.color[0] : (params.color || ""),
      country: params.country ? (Array.isArray(params.country) ? params.country : [params.country]) : [],
      field: params.field ? (Array.isArray(params.field) ? params.field : [params.field]) : [],
      domain: params.domain ? (Array.isArray(params.domain) ? params.domain : [params.domain]) : [],
    };
  };

  const [filters, setFilters] = React.useState(getFiltersFromUrl());
  const [view, setView] = React.useState("grid");
  const [dateRange, setDateRange] = useState(range);

  // All existing useEffect hooks and logic remain the same
  useEffect(() => {
    if (!kanbanView) return;
    const jobs = jobsByDate.flatMap(day => day.jobs);

        // Apply the same filtering logic as in the list/grid view
        const filteredJobs = jobs.filter(job => {
          if (filters.jobType && job.employmentType !== filters.jobType) {
            return false;
          }
          if (filters.field && filters.field.length > 0 && !filters.field.includes(job.title)) {
            return false;
          }
          if (filters.status && job.currentStatus !== filters.status) return false;
          if (filters.domain && filters.domain.length > 0 && !filters.domain.includes(job.predicted_domain)) {
            return false;
          }
          if (filters.country && filters.country.length > 0) {
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
          return true;
        });


    const grouped = {};
    statusOrder.forEach(status => {
      grouped[status] = filteredJobs.filter(job => job.currentStatus === status);
    });
    setKanbanJobs(grouped);
  }, [jobsByDate, kanbanView,filters ]);

  // All existing handlers remain the same
  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    if (sourceStatus === destStatus && source.index === destination.index) return;

    const job = (kanbanJobs[sourceStatus] || [])[source.index];
    if (!job) return;

    const companyJobId = job._id || job.companyJobId || job.id || job.jobId;
    if (!companyJobId) {
      setKanbanError('Missing company job _id. Open this job from your assigned list.');
      return;
    }

    const updateId = `${companyJobId}-${Date.now()}`;

    // Clear previous errors
    setKanbanError(null);

    // Save original state
    const originalKanbanJobs = { ...kanbanJobs };
    const originalJobStatus = job.currentStatus;

    // Optimistic UI update
    const newKanbanJobs = { ...kanbanJobs };
    newKanbanJobs[sourceStatus] = Array.from(newKanbanJobs[sourceStatus]);
    newKanbanJobs[sourceStatus].splice(source.index, 1);
    newKanbanJobs[destStatus] = Array.from(newKanbanJobs[destStatus]);

    const updatedJob = {
      ...job,
      currentStatus: destStatus,
      isUpdating: true,
      updateId
    };
    newKanbanJobs[destStatus].splice(destination.index, 0, updatedJob);

    setKanbanJobs(newKanbanJobs);
    setOptimisticUpdates(prev => new Set(prev).add(updateId));

    try {
-     await dispatch(updateUpworkJobStatusNewThunk({ jobId: companyJobId, status: destStatus })).unwrap();
+     await dispatch(updateJobStatusNewThunk({ jobId: companyJobId, status: destStatus })).unwrap();

      // Clear updating indicator
      setKanbanJobs(prevJobs => {
        const updatedJobs = { ...prevJobs };
        Object.keys(updatedJobs).forEach(status => {
          updatedJobs[status] = updatedJobs[status].map(j =>
            j.updateId === updateId ? { ...j, isUpdating: false, updateId: undefined } : j
          );
        });
        return updatedJobs;
      });

      setOptimisticUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateId);
        return newSet;
      });

      // Refresh in background
      dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 250 }));
    } catch (err) {
      console.error('Failed to update job status:', err);
      setKanbanJobs(originalKanbanJobs);
      setKanbanError(`Failed to move "${job.title}" to ${statusLabels[destStatus]}. Please try again.`);
      setFailedUpdates(prev => new Map(prev).set(job._id, {
        jobTitle: job.title,
        fromStatus: originalJobStatus,
        toStatus: destStatus,
        timestamp: Date.now()
      }));
      setOptimisticUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateId);
        return newSet;
      });
      setTimeout(() => {
        setKanbanError(null);
        setFailedUpdates(prev => {
          const newMap = new Map(prev);
          newMap.delete(job._id);
          return newMap;
        });
      }, 5000);
    }
  };

  // const handleRangeChange = (e) => {
  //   const newRange = e.target.value;
  //   setRange(newRange);
  //   setPage(1);
  //   dispatch(resetJobs());
  //   dispatch(fetchJobsPaginatedThunk({ range: newRange, page: 1, limit: 10 }));
  // };

//   const observer = useRef();
// const lastJobRef = useCallback(
//   (node) => {
//     if (loading) return;
//     if (observer.current) observer.current.disconnect();
//     observer.current = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting && hasMore) {
//         setPage(prev => prev + 1);
//       }
//     });
//     if (node) observer.current.observe(node);
//   },
//   [loading, hasMore]
// );

const [page, setPage] = useState(1);
const observer = React.useRef(null);
const didInitialFetch = React.useRef(false);

useEffect(() => {
  // initial load and when range changes (only once per range)
  setPage(1);
  dispatch(resetJobsByDate());
  if (!didInitialFetch.current) {
    didInitialFetch.current = true;
    dispatch(fetchJobsByDateThunk({ range: dateRange, page: 1, limit: 250 }));
  }
}, [dateRange, dispatch]);


const lastJobRef = React.useCallback(node => {
  if (loading) return;
  if (observer.current) observer.current.disconnect();
  observer.current = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore) {
      setPage(prev => prev + 1);
    }
  });
  if (node) observer.current.observe(node);
}, [loading, hasMore]);


const handleDateRangeChange = (e) => {
  const val = e.target.value; // '1d' | '3d' | '7d'
  setDateRange(val);
  dispatch(setRange(val));
  setPage(1);
  dispatch(resetJobsByDate());
  dispatch(fetchJobsByDateThunk({ range: val, page: 1, limit: 250 }));
};

  useEffect(() => {
    localStorage.setItem("jobsByDate", JSON.stringify(jobsByDate));
  }, [jobsByDate]);

  // // useEffect(() => {
  // //   setFilters(getFiltersFromUrl());
  // // }, [location.search]);

  // useEffect(() => {
  //   if (!jobsByDate || jobsByDate.length === 0 || jobsByDate.every(day => !day.jobs || day.jobs.length === 0)) {
  //     dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 10 }));
  //   }
  // }, [dispatch, range, jobsByDate]);

  // const handleJobClick = (job) => {
  //   navigate(`/jobs/${job.id}`, { state: { job } });
  // };

  const handleJobClick = async (job) => {
    let cid = job._id || job.companyJobId;
    if (!cid || String(cid).length !== 24) {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE}/company-jobs/user-jobs?page=1&limit=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
        const externalId = job.jobId || job.id;
        const match = jobs.find(j =>
          String(j.jobId) === String(externalId) ||
          String(j.masterJobId) === String(externalId)
        );
        cid = match?._id;
      } catch (e) {
        console.warn("Failed to resolve company job _id", e);
      }
    }
    if (!cid || String(cid).length !== 24) {
      console.warn('Missing company job _id; cannot open details.', job);
      return;
    }
    navigate(`/company-jobs/${cid}`, { state: { job } });
  };

  // All existing filter logic remains the same
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

  useEffect(() => {
    setFilters(getFiltersFromUrl());
  }, [location.search]);

  // All existing data processing logic remains the same
  const allJobs = jobsByDate.flatMap((d) => d.jobs);

  // const filteredJobsByDate = jobsByDate.map((day) => ({
  //   date: day.date,
  //   jobs: day.jobs.filter((job) => {
  //     if (filters.type && !(Array.isArray(job.employmentType) ? job.employmentType.includes(filters.type) : job.employmentType === filters.type)) {
  //       return false;
  //     }
  //     if (filters.field.length > 0 && !filters.field.includes(job.title)) {
  //       return false;
  //     }
  //     if (filters.status && job.currentStatus !== filters.status) return false;
  //     if (filters.domain.length > 0 && !filters.domain.includes(job.predicted_domain)) {
  //       return false;
  //     }
  //     if (filters.country.length > 0) {
  //       let jobCountries = [];
  //       if (Array.isArray(job.locations)) {
  //         jobCountries = job.locations.map((loc) => {
  //           if (typeof loc === "string") {
  //             const parts = loc.split(",");
  //             return parts[parts.length - 1]?.trim();
  //           }
  //           if (typeof loc === "object" && loc !== null && "country" in loc) {
  //             return loc.country;
  //           }
  //           return null;
  //         }).filter(Boolean);
  //       } else if (typeof job.locations === "string") {
  //         const parts = job.locations.split(",");
  //         jobCountries = [parts[parts.length - 1]?.trim()];
  //       }
  //       if (!jobCountries.some((c) => filters.country.includes(c))) {
  //         return false;
  //       }
  //     }
  //     const colorValue = job.tier || job.tierColor;
  //     if (filters.color && filters.color !== "" && colorValue !== filters.color) {
  //       return false;
  //     }
  //     if (filters.jobType && job.employmentType !== filters.jobType) return false;
  //     return true;
  //   }),
  // }));

  // ADD: only keep days that actually have jobs

  const filteredJobsByDate = jobsByDate.map((day) => ({
    date: day.date,
    jobs: day.jobs.filter((job) => {
      if (filters.type && !(Array.isArray(job.employmentType) ? job.employmentType.includes(filters.type) : job.employmentType === filters.type)) return false;
      if (filters.field.length > 0 && !filters.field.includes(job.title)) return false;
      if (filters.status && job.currentStatus !== filters.status) return false;
      if (filters.domain.length > 0 && !filters.domain.includes(job.predicted_domain)) return false;

      // Country: only use country
      if (filters.country.length > 0) {
        let jobCountries = [];

        // Prefer company.locations[*].country
        if (Array.isArray(job.company?.locations)) {
          jobCountries = job.company.locations
            .map(loc => (loc && typeof loc === 'object' ? loc.country : null))
            .filter(Boolean);
        }

        // Fallback to job.locations parse if no company countries found
        if (jobCountries.length === 0) {
          if (Array.isArray(job.locations)) {
            jobCountries = job.locations
              .map(loc => {
                if (typeof loc === "object" && loc !== null && "country" in loc) return loc.country;
                if (typeof loc === "string") {
                  const parts = loc.split(",");
                  return parts[parts.length - 1]?.trim();
                }
                return null;
              })
              .filter(Boolean);
          } else if (typeof job.locations === "string") {
            const parts = job.locations.split(",");
            jobCountries = [parts[parts.length - 1]?.trim()];
          }
        }

        if (!jobCountries.some(c => filters.country.includes(c))) return false;
      }

      const colorValue = job.tier || job.tierColor;
      if (filters.color && filters.color !== "" && colorValue !== filters.color) return false;
      if (filters.jobType && job.employmentType !== filters.jobType) return false;
      return true;
    }),
  }));
  
  const nonEmptyDays = filteredJobsByDate.filter(
  (d) => Array.isArray(d.jobs) && d.jobs.length > 0
);

  // Dynamic filter options remain the same
  const categories = Array.from(new Set(allJobs.map((j) => j.seniority).filter(Boolean)));
  // const countries = Array.from(
  //   new Set(
  //     allJobs
  //       .flatMap((j) => {
  //         if (Array.isArray(j.locations)) {
  //           return j.locations.map((loc) => {
  //             if (typeof loc === "string") {
  //               const parts = loc.split(",");
  //               return parts[parts.length - 1]?.trim();
  //             }
  //             return null;
  //           });
  //         }
  //         if (typeof j.locations === "string") {
  //           const parts = j.locations.split(",");
  //           return [parts[parts.length - 1]?.trim()];
  //         }
  //         return [];
  //       })
  //       .filter(Boolean)
  //   )
  // );
  const countries = Array.from(
    new Set(
      allJobs
        .flatMap((j) => {
          // Prefer company.locations[*].country
          if (Array.isArray(j.company?.locations)) {
            return j.company.locations
              .map(loc => (loc && typeof loc === 'object' ? loc.country : null))
              .filter(Boolean);
          }
          // Fallback to job.locations
          if (Array.isArray(j.locations)) {
            return j.locations
              .map(loc => {
                if (typeof loc === "object" && loc !== null && "country" in loc) return loc.country;
                if (typeof loc === "string") {
                  const parts = loc.split(",");
                  return parts[parts.length - 1]?.trim();
                }
                return null;
              })
              .filter(Boolean);
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

  // Calculate total jobs for stats
  const totalJobs = kanbanView ? Object.values(kanbanJobs).flat().length : allJobs.length;
  const jobStats = statusOrder.reduce((acc, status) => {
    if (kanbanView) {
      acc[status] = kanbanJobs[status] ? kanbanJobs[status].length : 0;
    } else {
      acc[status] = allJobs.filter(job => job.currentStatus === status).length;
    }
    return acc;
  }, {});

  const retryFailedUpdate = async (jobId) => {
    const failedUpdate = failedUpdates.get(jobId);
    if (!failedUpdate) return;

    const job = Object.values(kanbanJobs).flat().find(j => j.id === jobId);
    if (!job) return;

    // Remove from failed updates
    setFailedUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(jobId);
      return newMap;
    });

    // Simulate drag and drop to retry
    const fakeResult = {
      source: { droppableId: failedUpdate.fromStatus, index: 0 },
      destination: { droppableId: failedUpdate.toStatus, index: 0 }
    };

    // Find the job in current kanban state and retry
    const currentStatus = job.currentStatus;
    const currentIndex = kanbanJobs[currentStatus].findIndex(j => j.id === jobId);
    
    if (currentIndex !== -1) {
      fakeResult.source = { droppableId: currentStatus, index: currentIndex };
      await onDragEnd(fakeResult);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <Header source="linkedin" user={user} onLogout={handleLogout} onExport={handleExport} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Stats Cards Row */}
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statusOrder.map(status => {
          const config = statusConfig[status];
          const count = jobStats[status] || 0;
          
          return (
            <div key={status} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-3 h-3 ${config.dotColor} rounded-full`}></div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
              </div>
              <div className="text-xs font-medium text-gray-600 leading-tight">
                {config.label}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {count === 0 ? 'No jobs' : count === 1 ? '1 job' : `${count} jobs`}
              </div>
            </div>
          );
        })}
      </div>
  </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Sidebar */}
          <aside className={`lg:w-80 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  Filters
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <SidebarFilters
                categories={categories}
                jobTypeOptions={linkedInJobTypeOptions}
                jobTypeLabel="Employment Type"
                filters={filters}
                colors={colors}
                countries={countries}
                fields={fields}
                domains={domains}
                statusOptions={statusOptions}
                onFilterChange={handleFilterChange}
                isPipelineView={kanbanView}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Enhanced Controls Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              {/* Top Row - Date Range and Mobile Filter Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <label htmlFor="date-range" className="font-medium text-gray-700">
                    Time Range:
                  </label>
                  <select
                    id="date-range"
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {dateRanges.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>

              {/* View Controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        !kanbanView 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setKanbanView(false)}
                    >
                      <Eye className="h-4 w-4" />
                      List/Grid
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        kanbanView 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setKanbanView(true)}
                    >
                      <Kanban className="h-4 w-4" />
                      Pipeline
                    </button>
                      {/* Quick AI filter */}
                <div className="flex items-center gap-2">
                  {/* <span className="text-sm font-medium text-gray-700">AI Recommended:</span> */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        !filters?.color || filters?.color === ''
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setFilters(prev => ({ ...prev, color: '' }))}
                      // onClick={() => onFilterChange('color', '')}
                    >
                      All
                    </button>
                    <button
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        filters?.color === 'Green'
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                       onClick={() => setFilters(prev => ({ ...prev, color: 'Green' }))}
                      // onClick={() => onFilterChange('color', 'Green')}
                    >
                      AI Recommended
                    </button>
                  </div>
                </div>
                  </div>
                </div>

                {/* Grid/List Toggle (only when not in kanban view) */}
                {!kanbanView && (
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        view === "grid" 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setView("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      Grid
                    </button>
                    <button
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                        view === "list" 
                          ? "bg-white text-blue-600 shadow-sm" 
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                      List
                    </button>
                  </div>
                )}
              </div>

              {/* Kanban User Selection */}
              {kanbanView && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-sm text-green-800">
                  Drag and drop cards between columns to update status.
                </div>
              )}
            </div>

              {/* Pipeline/pipeline loader */}
              {(!pipeline ) && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-700 text-sm">Loading pipeline...</span>
                  </div>
                </div>
              )}

              {/* Content Area */}
            {kanbanView ? (
              // Enhanced Kanban View
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Enhanced error display with retry options */}
                {kanbanError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-red-700 text-sm">{kanbanError}</p>
                        {failedUpdates.size > 0 && (
                          <div className="mt-2">
                            <p className="text-red-600 text-xs mb-2">Failed updates:</p>
                            {Array.from(failedUpdates.entries()).map(([jobId, update]) => (
                              <div key={jobId} className="flex items-center justify-between bg-red-100 rounded px-2 py-1 mb-1">
                                <span className="text-xs text-red-700 truncate">
                                  {update.jobTitle} → {statusLabels[update.toStatus]}
                                </span>
                                <button
                                  onClick={() => retryFailedUpdate(jobId)}
                                  className="text-xs text-red-600 hover:text-red-800 ml-2 px-2 py-1 bg-red-200 rounded hover:bg-red-300 transition-colors"
                                >
                                  Retry
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Real-time update status bar */}
                {optimisticUpdates.size > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-700 text-sm">
                        Updating {optimisticUpdates.size} job{optimisticUpdates.size !== 1 ? 's' : ''}...
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 min-w-max pb-4">
                      {statusOrder.map((status) => {
                        const config = statusConfig[status];
                        const jobs = kanbanJobs[status] || [];
                        
                        return (
                          <Droppable droppableId={status} key={status}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`
                                  w-80 ${config.color} rounded-xl border ${config.borderColor}
                                  transition-all duration-200 ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                                `}
                                style={{ maxHeight: "70vh" }}
                              >
                                {/* Enhanced Column Header */}
                                <div className={`
                                  ${config.headerColor} ${config.textColor} px-4 py-4 rounded-t-xl
                                  border-b ${config.borderColor}
                                `}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 ${config.dotColor} rounded-full`}></div>
                                      <h3 className="font-semibold text-sm">
                                        {config.label}
                                      </h3>
                                    </div>
                                    <span className={`
                                      ${config.textColor} bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs font-medium
                                    `}>
                                      {jobs.length}
                                    </span>
                                  </div>
                                </div>

                                {/* Column Content */}
                                <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(70vh - 80px)" }}>
                                  {jobs.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                      <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                      <p className="text-sm">No jobs in this stage</p>
                                    </div>
                                  ) : (
                                    jobs.map((job, idx) => (
                                      <Draggable
                                        key={ job.id}
                                        draggableId={(job._id || job.id)}
                                        index={idx}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`
                                              bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3
                                              cursor-grab hover:shadow-md transition-all duration-200 relative
                                              ${snapshot.isDragging ? 'shadow-lg rotate-1 ring-2 ring-blue-400' : ''}
                                              ${job.isUpdating ? 'opacity-75' : ''}
                                            `}
                                            onClick={() => !job.isUpdating && handleJobClick(job)}
                                          >
                                            {job.isUpdating && (
                                              <div className="absolute top-2 right-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                              </div>
                                            )}

                                            {failedUpdates.has(job._id) && (
                                              <div className="absolute top-2 right-2">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    retryFailedUpdate(job._id);
                                                  }}
                                                  className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                  title="Click to retry"
                                                >
                                                  ↻
                                                </button>
                                              </div>
                                            )}

                                            <div className="flex items-start gap-2 mb-2">
                                              <Briefcase className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                              <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
                                                {job.title}
                                              </h4>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                              <p className="text-gray-600 text-sm truncate">
                                              {typeof job.company === "object"
                                                  ? job.company?.name
                                                  : job.company || job.companyName}
                                              </p>
                                            </div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.textColor} ${config.color}`}>
                                              {config.label}
                                              {job.isUpdating && (
                                                <div className="ml-1 w-2 h-2 bg-current rounded-full animate-ping"></div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))
                                  )}
                                  {provided.placeholder}
                                </div>
                              </div>
                            )}
                          </Droppable>
                        );
                      })}
                    </div>
                  </DragDropContext>
                </div>

                {/* Remove this old loading overlay */}
                {/* {kanbanLoading && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="text-gray-700">Updating job status...</span>
                    </div>
                  </div>
                )} */}
              </div>
            ) : (
              // Enhanced List/Grid View
                           // Enhanced List/Grid View
                           <div className="space-y-6">
                           {loading ? (
                             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                               <p className="text-gray-600">Loading jobs...</p>
                             </div>
                           ) : error ? (
                             <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                               <div className="flex items-center gap-2 text-red-600">
                                 <AlertCircle className="h-5 w-5" />
                                 <span>{error}</span>
                               </div>
                             </div>
                           ) : nonEmptyDays.length === 0 ? (
                             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                               <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                               <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                               <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                             </div>
                           ) : (
                             nonEmptyDays.map((day) => (
                               <section key={day.date} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                 <div className={
                                   view === "grid"
                                     ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                                     : "flex flex-col gap-4"
                                 }>
                                      {Array.isArray(day.jobs) && day.jobs.length > 0 ? (
                                        day.jobs.map((job) => (
                                          <JobCard
                                            key={job.id}
                                            job={job}
                                            onClick={() => handleJobClick(job)}
                                            view={view}
                                            statusOptions={statusOptions}
                                          />
                                        ))
                                      ) : (
                                     <div className="col-span-full text-center py-8 text-gray-500">
                                       <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                       <p>No jobs for this date.</p>
                                     </div>
                                   )}
                                 </div>
                               </section>
                             ))
                           )}
           
                           {/* Sentinel for lazy loading: place AFTER the map, still inside the list container */}
                           {!kanbanView && filteredJobsByDate.length > 0 && (
                             <div ref={lastJobRef} className="h-1 w-full" />
                           )}
                         </div> 
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
// "use client"

// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import queryString from "query-string";
// import { useSelector, useDispatch } from "react-redux";
// import JobCard from "../components/JobCard";
// import Header from "../components/Header";
// import SidebarFilters from "../components/SidebarFilters";
// import { fetchlinkedinJobsByDateRange } from "../api/jobService";
// import {
//   fetchJobsByDateThunk,
//   resetJobsByDate,
//   setRange,
//   updateJobStatusThunk
// } from "../slices/jobsSlice";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { logoutUser } from "../api/authApi";
// import { Calendar, Grid3X3, List, Kanban, Users, AlertCircle, Briefcase, Building2, Filter, Download, Search, ChevronDown, Eye, BarChart3 } from 'lucide-react';

// const statusLabels = {
//   not_engaged: "Not Engaged",
//   applied: "Applied",
//   engaged: "Engaged",
//   interview: "Interview",
//   offer: "Offer",
//   rejected: "Rejected",
//   archived: "Archived",
// };

// const statusOrder = [
//   "not_engaged",
//   "applied",
//   "engaged",
//   "interview",
//   "offer",
//   "rejected",
//   "archived",
// ];

// // Enhanced status configuration with colors
// const statusConfig = {
//   not_engaged: {
//     label: "Not Engaged",
//     color: "bg-gray-50",
//     headerColor: "bg-gray-100",
//     textColor: "text-gray-700",
//     borderColor: "border-gray-200",
//     dotColor: "bg-gray-400"
//   },
//   applied: {
//     label: "Applied",
//     color: "bg-blue-50",
//     headerColor: "bg-blue-100",
//     textColor: "text-blue-700",
//     borderColor: "border-blue-200",
//     dotColor: "bg-blue-400"
//   },
//   engaged: {
//     label: "Engaged",
//     color: "bg-yellow-50",
//     headerColor: "bg-yellow-100",
//     textColor: "text-yellow-700",
//     borderColor: "border-yellow-200",
//     dotColor: "bg-yellow-400"
//   },
//   interview: {
//     label: "Interview",
//     color: "bg-purple-50",
//     headerColor: "bg-purple-100",
//     textColor: "text-purple-700",
//     borderColor: "border-purple-200",
//     dotColor: "bg-purple-400"
//   },
//   offer: {
//     label: "Offer",
//     color: "bg-green-50",
//     headerColor: "bg-green-100",
//     textColor: "text-green-700",
//     borderColor: "border-green-200",
//     dotColor: "bg-green-400"
//   },
//   rejected: {
//     label: "Rejected",
//     color: "bg-red-50",
//     headerColor: "bg-red-100",
//     textColor: "text-red-700",
//     borderColor: "border-red-200",
//     dotColor: "bg-red-400"
//   },
//   archived: {
//     label: "Archived",
//     color: "bg-slate-50",
//     headerColor: "bg-slate-100",
//     textColor: "text-slate-700",
//     borderColor: "border-slate-200",
//     dotColor: "bg-slate-400"
//   },
// };

// // Default filters remain the same
// const defaultFilters = {
//   type: "",
//   category: "",
//   color: [],
//   country: [],
//   seniority: "",
//   field: [],
//   domain: [],
//   status: "",
// };

// // Static filter options remain the same
// const linkedInJobTypeOptions = [
//   { value: "", label: "All" },
//   { value: "full_time", label: "Full Time" },
//   { value: "part_time", label: "Part Time" },
//   { value: "contract", label: "Contract" },
//   { value: "freelance", label: "Freelance" },
// ];

// const colors = ["Yellow", "Green", "Red"];
// const statusOptions = [
//   "not_engaged",
//   "applied",
//   "engaged",
//   "interview",
//   "offer",
//   "rejected",
//   "archived"
// ];

// const dateRanges = [
//   { label: "Last 24 Hours", value: "1d" },
//   { label: "Last 3 Days", value: "3d" },
//   { label: "Last 7 Days", value: "7d" },
// ];

// function getStartDate(range) {
//   const today = new Date();
//   let start = new Date(today);
//   if (range === "1d") start.setDate(today.getDate() - 1);
//   if (range === "3d") start.setDate(today.getDate() - 3);
//   if (range === "7d") start.setDate(today.getDate() - 7);
//   return start.toISOString().slice(0, 10);
// }

// function getEndDate() {
//   const today = new Date();
//   return today.toISOString().slice(0, 10);
// }

// const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [kanbanView, setKanbanView] = useState(false);
//   const [kanbanJobs, setKanbanJobs] = useState({});
//   const [kanbanLoading, setKanbanLoading] = useState(false);
//   const [kanbanError, setKanbanError] = useState(null);
//   const [kanbanUser, setKanbanUser] = useState("");
//   const [kanbanUserError, setKanbanUserError] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [optimisticUpdates, setOptimisticUpdates] = useState(new Set());
//   const [failedUpdates, setFailedUpdates] = useState(new Map());

//   const { jobsByDate, loading, error, range } = useSelector(
//     (state) => state.jobs
//   );
//   const user = useSelector((state) => state.user.user);

//   // Parse filters from URL (logic remains the same)
//   const getFiltersFromUrl = () => {
//     const params = queryString.parse(location.search, { arrayFormat: 'bracket' });
//     return {
//       ...defaultFilters,
//       ...params,
//       color: Array.isArray(params.color) ? params.color[0] : (params.color || ""),
//       country: params.country ? (Array.isArray(params.country) ? params.country : [params.country]) : [],
//       field: params.field ? (Array.isArray(params.field) ? params.field : [params.field]) : [],
//       domain: params.domain ? (Array.isArray(params.domain) ? params.domain : [params.domain]) : [],
//     };
//   };

//   const [filters, setFilters] = React.useState(getFiltersFromUrl());
//   const [view, setView] = React.useState("grid");
//   const [dateRange, setDateRange] = useState(range);

//   // All existing useEffect hooks and logic remain the same
//   useEffect(() => {
//     if (!kanbanView) return;
//     const jobs = jobsByDate.flatMap(day => day.jobs);
//     const grouped = {};
//     statusOrder.forEach(status => {
//       grouped[status] = jobs.filter(job => job.currentStatus === status);
//     });
//     setKanbanJobs(grouped);
//   }, [jobsByDate, kanbanView]);

//   // All existing handlers remain the same
//   const onDragEnd = async (result) => {
//     const { source, destination } = result;
//     if (!destination) return;
    
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     ) {
//       return;
//     }

//     if (!kanbanUser) {
//       setKanbanUserError("Please select a user before changing status.");
//       return;
//     }

//     const sourceStatus = source.droppableId;
//     const destStatus = destination.droppableId;
//     const job = kanbanJobs[sourceStatus][source.index];
//     if (!job) return;

//     const updateId = `${job.id}-${Date.now()}`;
    
//     // Clear any previous errors for this job
//     setKanbanError(null);
//     setKanbanUserError("");
    
//     // Store original state for potential reversion
//     const originalKanbanJobs = { ...kanbanJobs };
//     const originalJobStatus = job.currentStatus;

//     // IMMEDIATE UI UPDATE (Optimistic)
//     const newKanbanJobs = { ...kanbanJobs };
//     newKanbanJobs[sourceStatus] = Array.from(newKanbanJobs[sourceStatus]);
//     newKanbanJobs[sourceStatus].splice(source.index, 1);
//     newKanbanJobs[destStatus] = Array.from(newKanbanJobs[destStatus]);
    
//     const updatedJob = { 
//       ...job, 
//       currentStatus: destStatus,
//       isUpdating: true, // Add visual indicator
//       updateId: updateId
//     };
//     newKanbanJobs[destStatus].splice(destination.index, 0, updatedJob);

//     // Update UI immediately
//     setKanbanJobs(newKanbanJobs);
//     setOptimisticUpdates(prev => new Set(prev).add(updateId));

//     // Background API call
//     try {
//       await dispatch(updateJobStatusThunk({
//         jobId: job.id,
//         status: destStatus,
//         username: kanbanUser,
//       })).unwrap();

//       // Success - remove updating indicator
//       setKanbanJobs(prevJobs => {
//         const updatedJobs = { ...prevJobs };
//         Object.keys(updatedJobs).forEach(status => {
//           updatedJobs[status] = updatedJobs[status].map(j => 
//             j.updateId === updateId 
//               ? { ...j, isUpdating: false, updateId: undefined }
//               : j
//           );
//         });
//         return updatedJobs;
//       });

//       setOptimisticUpdates(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(updateId);
//         return newSet;
//       });

//       // Optionally refresh data in background without affecting UI
//       dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
      
//     } catch (err) {
//       console.error('Failed to update job status:', err);
      
//       // REVERT UI on failure
//       setKanbanJobs(originalKanbanJobs);
      
//       // Show error with job details
//       setKanbanError(`Failed to move "${job.title}" to ${statusLabels[destStatus]}. Please try again.`);
      
//       // Track failed update
//       setFailedUpdates(prev => new Map(prev).set(job.id, {
//         jobTitle: job.title,
//         fromStatus: originalJobStatus,
//         toStatus: destStatus,
//         timestamp: Date.now()
//       }));

//       // Remove from optimistic updates
//       setOptimisticUpdates(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(updateId);
//         return newSet;
//       });

//       // Auto-clear error after 5 seconds
//       setTimeout(() => {
//         setKanbanError(null);
//         setFailedUpdates(prev => {
//           const newMap = new Map(prev);
//           newMap.delete(job.id);
//           return newMap;
//         });
//       }, 5000);
//     }
//   };

//   const handleDateRangeChange = (e) => {
//     setDateRange(e.target.value);
//     dispatch(setRange(e.target.value));
//     dispatch(fetchJobsByDateThunk({ range: e.target.value, page: 1, limit: 1000 }));
//   };

//   // All existing useEffect hooks remain the same
//   useEffect(() => {
//     localStorage.setItem("jobsByDate", JSON.stringify(jobsByDate));
//   }, [jobsByDate]);

//   useEffect(() => {
//     setFilters(getFiltersFromUrl());
//   }, [location.search]);

//   useEffect(() => {
//     if (!jobsByDate || jobsByDate.length === 0 || jobsByDate.every(day => !day.jobs || day.jobs.length === 0)) {
//       dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
//     }
//   }, [dispatch, range, jobsByDate]);

//   const handleJobClick = (job) => {
//     navigate(`/jobs/${job.id}`, { state: { job } });
//   };

//   // All existing filter logic remains the same
//   const handleFilterChange = (key, value) => {
//     const newFilters = { ...filters, [key]: value };
//     setFilters(newFilters);
//     const filtersForUrl = { ...newFilters };
//     Object.keys(filtersForUrl).forEach(k => {
//       if (
//         filtersForUrl[k] === "" ||
//         (Array.isArray(filtersForUrl[k]) && filtersForUrl[k].length === 0)
//       ) {
//         delete filtersForUrl[k];
//       }
//     });
//     if (filtersForUrl.color && Array.isArray(filtersForUrl.color)) {
//       filtersForUrl.color = filtersForUrl.color[0];
//     }
//     const query = queryString.stringify(filtersForUrl, { arrayFormat: 'bracket' });
//     navigate(`?${query}`, { replace: true });
//   };

//   useEffect(() => {
//     setFilters(getFiltersFromUrl());
//   }, [location.search]);

//   // All existing data processing logic remains the same
//   const allJobs = jobsByDate.flatMap((d) => d.jobs);

//   const filteredJobsByDate = jobsByDate.map((day) => ({
//     date: day.date,
//     jobs: day.jobs.filter((job) => {
//       if (filters.type && !(Array.isArray(job.employmentType) ? job.employmentType.includes(filters.type) : job.employmentType === filters.type)) {
//         return false;
//       }
//       if (filters.field.length > 0 && !filters.field.includes(job.title)) {
//         return false;
//       }
//       if (filters.status && job.currentStatus !== filters.status) return false;
//       if (filters.domain.length > 0 && !filters.domain.includes(job.predicted_domain)) {
//         return false;
//       }
//       if (filters.country.length > 0) {
//         let jobCountries = [];
//         if (Array.isArray(job.locations)) {
//           jobCountries = job.locations.map((loc) => {
//             if (typeof loc === "string") {
//               const parts = loc.split(",");
//               return parts[parts.length - 1]?.trim();
//             }
//             if (typeof loc === "object" && loc !== null && "country" in loc) {
//               return loc.country;
//             }
//             return null;
//           }).filter(Boolean);
//         } else if (typeof job.locations === "string") {
//           const parts = job.locations.split(",");
//           jobCountries = [parts[parts.length - 1]?.trim()];
//         }
//         if (!jobCountries.some((c) => filters.country.includes(c))) {
//           return false;
//         }
//       }
//       const colorValue = job.tier || job.tierColor;
//       if (filters.color && filters.color !== "" && colorValue !== filters.color) {
//         return false;
//       }
//       if (filters.jobType && job.employmentType !== filters.jobType) return false;
//       return true;
//     }),
//   }));

//   // Dynamic filter options remain the same
//   const categories = Array.from(new Set(allJobs.map((j) => j.seniority).filter(Boolean)));
//   const countries = Array.from(
//     new Set(
//       allJobs
//         .flatMap((j) => {
//           if (Array.isArray(j.locations)) {
//             return j.locations.map((loc) => {
//               if (typeof loc === "string") {
//                 const parts = loc.split(",");
//                 return parts[parts.length - 1]?.trim();
//               }
//               return null;
//             });
//           }
//           if (typeof j.locations === "string") {
//             const parts = j.locations.split(",");
//             return [parts[parts.length - 1]?.trim()];
//           }
//           return [];
//         })
//         .filter(Boolean)
//     )
//   );

//   const fields = Array.from(
//     new Set(
//       allJobs
//         .map((j) => j.title)
//         .filter(Boolean)
//     )
//   );

//   const domains = Array.from(
//     new Set(
//       allJobs
//         .map((j) => j.predicted_domain)
//         .filter(Boolean)
//     )
//   );

//   const handleExport = () => {
//     alert("Exporting jobs...");
//   };

//   const handleLogout = () => {
//     logoutUser(dispatch);
//     navigate("/login");
//   };

//   // Calculate total jobs for stats
//   const totalJobs = allJobs.length;
//   const jobStats = statusOrder.reduce((acc, status) => {
//     acc[status] = allJobs.filter(job => job.currentStatus === status).length;
//     return acc;
//   }, {});

//   const retryFailedUpdate = async (jobId) => {
//     const failedUpdate = failedUpdates.get(jobId);
//     if (!failedUpdate) return;

//     const job = Object.values(kanbanJobs).flat().find(j => j.id === jobId);
//     if (!job) return;

//     // Remove from failed updates
//     setFailedUpdates(prev => {
//       const newMap = new Map(prev);
//       newMap.delete(jobId);
//       return newMap;
//     });

//     // Simulate drag and drop to retry
//     const fakeResult = {
//       source: { droppableId: failedUpdate.fromStatus, index: 0 },
//       destination: { droppableId: failedUpdate.toStatus, index: 0 }
//     };

//     // Find the job in current kanban state and retry
//     const currentStatus = job.currentStatus;
//     const currentIndex = kanbanJobs[currentStatus].findIndex(j => j.id === jobId);
    
//     if (currentIndex !== -1) {
//       fakeResult.source = { droppableId: currentStatus, index: currentIndex };
//       await onDragEnd(fakeResult);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
// {/* Unified Header with Stats */}
// <div className="mb-6">
//   <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//     {/* Top Header Bar */}
//     <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
//               <BarChart3 className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white">Job Dashboard</h1>
//               <p className="text-blue-100 text-sm">Manage and track your applications</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Header Actions */}
//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <div className="text-2xl font-bold text-white">{totalJobs}</div>
//             <div className="text-xs text-blue-100">Total Jobs</div>
//           </div>
          
//           <div className="h-8 w-px bg-blue-500 mx-2"></div>
          
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-white text-sm font-medium transition-colors"
//             >
//               <Download className="h-4 w-4" />
//               Export
//             </button>
            
//             <div className="relative">
//               <button 
//                 type="button" 
//                 className="flex items-center gap-2 px-3 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg text-white text-sm font-medium transition-colors"
//                 onClick={handleLogout}
//               >
//                 <img
//                   className="h-6 w-6 rounded-full bg-white bg-opacity-20"
//                   src="/placeholder.svg?height=24&width=24"
//                   alt="User avatar"
//                 />
//                 <span className="hidden sm:block">{user?.name || 'Admin'}</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
    
//     {/* Stats Cards Row */}
//     <div className="p-6 bg-gray-50">
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
//         {statusOrder.map(status => {
//           const config = statusConfig[status];
//           const count = jobStats[status] || 0;
          
//           return (
//             <div key={status} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//               <div className="flex items-center justify-between mb-2">
//                 <div className={`w-3 h-3 ${config.dotColor} rounded-full`}></div>
//                 <div className="text-2xl font-bold text-gray-900">{count}</div>
//               </div>
//               <div className="text-xs font-medium text-gray-600 leading-tight">
//                 {config.label}
//               </div>
//               <div className="text-xs text-gray-400 mt-1">
//                 {count === 0 ? 'No jobs' : count === 1 ? '1 job' : `${count} jobs`}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   </div>
// </div>

//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Enhanced Sidebar */}
//           <aside className={`lg:w-80 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                   <Filter className="h-5 w-5 text-gray-600" />
//                   Filters
//                 </h2>
//                 <button
//                   onClick={() => setSidebarOpen(false)}
//                   className="lg:hidden text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>
//               <SidebarFilters
//                 categories={categories}
//                 jobTypeOptions={linkedInJobTypeOptions}
//                 jobTypeLabel="Employment Type"
//                 filters={filters}
//                 colors={colors}
//                 countries={countries}
//                 fields={fields}
//                 domains={domains}
//                 statusOptions={statusOptions}
//                 onFilterChange={handleFilterChange}
//               />
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1">
//             {/* Enhanced Controls Bar */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//               {/* Top Row - Date Range and Mobile Filter Toggle */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
//                 <div className="flex items-center gap-3">
//                   <Calendar className="h-5 w-5 text-gray-600" />
//                   <label htmlFor="date-range" className="font-medium text-gray-700">
//                     Time Range:
//                   </label>
//                   <select
//                     id="date-range"
//                     value={dateRange}
//                     onChange={handleDateRangeChange}
//                     className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     {dateRanges.map(opt => (
//                       <option key={opt.value} value={opt.value}>{opt.label}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <button
//                   onClick={() => setSidebarOpen(true)}
//                   className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
//                 >
//                   <Filter className="h-4 w-4" />
//                   Filters
//                 </button>
//               </div>

//               {/* View Controls */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                 {/* View Mode Toggle */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium text-gray-700">View:</span>
//                   <div className="flex bg-gray-100 rounded-lg p-1">
//                     <button
//                       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                         !kanbanView 
//                           ? "bg-white text-blue-600 shadow-sm" 
//                           : "text-gray-600 hover:text-gray-900"
//                       }`}
//                       onClick={() => setKanbanView(false)}
//                     >
//                       <Eye className="h-4 w-4" />
//                       List/Grid
//                     </button>
//                     <button
//                       className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
//                         kanbanView 
//                           ? "bg-white text-blue-600 shadow-sm" 
//                           : "text-gray-600 hover:text-gray-900"
//                       }`}
//                       onClick={() => setKanbanView(true)}
//                     >
//                       <Kanban className="h-4 w-4" />
//                       Pipeline
//                     </button>
//                   </div>
//                 </div>

//                 {/* Grid/List Toggle (only when not in kanban view) */}
//                 {!kanbanView && (
//                   <div className="flex bg-gray-100 rounded-lg p-1">
//                     <button
//                       className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
//                         view === "grid" 
//                           ? "bg-white text-blue-600 shadow-sm" 
//                           : "text-gray-600 hover:text-gray-900"
//                       }`}
//                       onClick={() => setView("grid")}
//                     >
//                       <Grid3X3 className="h-4 w-4" />
//                       Grid
//                     </button>
//                     <button
//                       className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
//                         view === "list" 
//                           ? "bg-white text-blue-600 shadow-sm" 
//                           : "text-gray-600 hover:text-gray-900"
//                       }`}
//                       onClick={() => setView("list")}
//                     >
//                       <List className="h-4 w-4" />
//                       List
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Kanban User Selection */}
//               {kanbanView && (
//                 <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//                     <div className="flex items-center gap-2">
//                       <Users className="h-5 w-5 text-blue-600" />
//                       <label className="font-medium text-blue-900">
//                         Select User for Status Changes:
//                       </label>
//                     </div>
//                     <select
//                       className="border border-blue-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       value={kanbanUser}
//                       onChange={e => {
//                         setKanbanUser(e.target.value);
//                         setKanbanUserError("");
//                       }}
//                     >
//                       <option value="">-- Select User --</option>
//                       {USER_LIST.map(user => (
//                         <option key={user} value={user}>{user}</option>
//                       ))}
//                     </select>
//                   </div>
//                   {kanbanUserError && (
//                     <div className="mt-2 flex items-center gap-2 text-red-600">
//                       <AlertCircle className="h-4 w-4" />
//                       <span className="text-sm">{kanbanUserError}</span>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Content Area */}
//             {kanbanView ? (
//               // Enhanced Kanban View
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 {/* Enhanced error display with retry options */}
//                 {kanbanError && (
//                   <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                     <div className="flex items-start gap-3">
//                       <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
//                       <div className="flex-1">
//                         <p className="text-red-700 text-sm">{kanbanError}</p>
//                         {failedUpdates.size > 0 && (
//                           <div className="mt-2">
//                             <p className="text-red-600 text-xs mb-2">Failed updates:</p>
//                             {Array.from(failedUpdates.entries()).map(([jobId, update]) => (
//                               <div key={jobId} className="flex items-center justify-between bg-red-100 rounded px-2 py-1 mb-1">
//                                 <span className="text-xs text-red-700 truncate">
//                                   {update.jobTitle} → {statusLabels[update.toStatus]}
//                                 </span>
//                                 <button
//                                   onClick={() => retryFailedUpdate(jobId)}
//                                   className="text-xs text-red-600 hover:text-red-800 ml-2 px-2 py-1 bg-red-200 rounded hover:bg-red-300 transition-colors"
//                                 >
//                                   Retry
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Real-time update status bar */}
//                 {optimisticUpdates.size > 0 && (
//                   <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                       <span className="text-blue-700 text-sm">
//                         Updating {optimisticUpdates.size} job{optimisticUpdates.size !== 1 ? 's' : ''}...
//                       </span>
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="overflow-x-auto">
//                   <DragDropContext onDragEnd={onDragEnd}>
//                     <div className="flex gap-6 min-w-max pb-4">
//                       {statusOrder.map((status) => {
//                         const config = statusConfig[status];
//                         const jobs = kanbanJobs[status] || [];
                        
//                         return (
//                           <Droppable droppableId={status} key={status}>
//                             {(provided, snapshot) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.droppableProps}
//                                 className={`
//                                   w-80 ${config.color} rounded-xl border ${config.borderColor}
//                                   transition-all duration-200 ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
//                                 `}
//                                 style={{ maxHeight: "70vh" }}
//                               >
//                                 {/* Enhanced Column Header */}
//                                 <div className={`
//                                   ${config.headerColor} ${config.textColor} px-4 py-4 rounded-t-xl
//                                   border-b ${config.borderColor}
//                                 `}>
//                                   <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                       <div className={`w-3 h-3 ${config.dotColor} rounded-full`}></div>
//                                       <h3 className="font-semibold text-sm">
//                                         {config.label}
//                                       </h3>
//                                     </div>
//                                     <span className={`
//                                       ${config.textColor} bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs font-medium
//                                     `}>
//                                       {jobs.length}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 {/* Column Content */}
//                                 <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(70vh - 80px)" }}>
//                                   {jobs.length === 0 ? (
//                                     <div className="text-center py-8 text-gray-400">
//                                       <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                                       <p className="text-sm">No jobs in this stage</p>
//                                     </div>
//                                   ) : (
//                                     jobs.map((job, idx) => (
//                                       <Draggable
//                                         key={job.id}
//                                         draggableId={job.id.toString()}
//                                         index={idx}
//                                       >
//                                         {(provided, snapshot) => (
//                                           <div
//                                             ref={provided.innerRef}
//                                             {...provided.draggableProps}
//                                             {...provided.dragHandleProps}
//                                             className={`
//                                               bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3
//                                               cursor-grab hover:shadow-md transition-all duration-200 relative
//                                               ${snapshot.isDragging ? 'shadow-lg rotate-1 ring-2 ring-blue-400' : ''}
//                                               ${job.isUpdating ? 'opacity-75' : ''}
//                                             `}
//                                             onClick={() => !job.isUpdating && handleJobClick(job)}
//                                           >
//                                             {/* Real-time update indicator */}
//                                             {job.isUpdating && (
//                                               <div className="absolute top-2 right-2">
//                                                 <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                                               </div>
//                                             )}
                                            
//                                             {/* Failed update indicator */}
//                                             {failedUpdates.has(job.id) && (
//                                               <div className="absolute top-2 right-2">
//                                                 <button
//                                                   onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     retryFailedUpdate(job.id);
//                                                   }}
//                                                   className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
//                                                   title="Click to retry"
//                                                 >
//                                                   ↻
//                                                 </button>
//                                               </div>
//                                             )}

//                                             <div className="flex items-start gap-2 mb-2">
//                                               <Briefcase className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
//                                               <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
//                                                 {job.title}
//                                               </h4>
//                                             </div>
//                                             <div className="flex items-center gap-2 mb-2">
//                                               <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
//                                               <p className="text-gray-600 text-sm truncate">
//                                                 {job.company || job.companyName}
//                                               </p>
//                                             </div>
//                                             <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.textColor} ${config.color}`}>
//                                               {config.label}
//                                               {job.isUpdating && (
//                                                 <div className="ml-1 w-2 h-2 bg-current rounded-full animate-ping"></div>
//                                               )}
//                                             </div>
//                                           </div>
//                                         )}
//                                       </Draggable>
//                                     ))
//                                   )}
//                                   {provided.placeholder}
//                                 </div>
//                               </div>
//                             )}
//                           </Droppable>
//                         );
//                       })}
//                     </div>
//                   </DragDropContext>
//                 </div>

//                 {/* Remove this old loading overlay */}
//                 {/* {kanbanLoading && (
//                   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg p-6 flex items-center gap-3">
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//                       <span className="text-gray-700">Updating job status...</span>
//                     </div>
//                   </div>
//                 )} */}
//               </div>
//             ) : (
//               // Enhanced List/Grid View
//               <div className="space-y-6">
//                 {loading ? (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading jobs...</p>
//                   </div>
//                 ) : error ? (
//                   <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
//                     <div className="flex items-center gap-2 text-red-600">
//                       <AlertCircle className="h-5 w-5" />
//                       <span>{error}</span>
//                     </div>
//                   </div>
//                 ) : filteredJobsByDate.length === 0 ? (
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//                     <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
//                     <p className="text-gray-600">Try adjusting your filters to see more results.</p>
//                   </div>
//                 ) : (
//                   filteredJobsByDate.map((day) => (
//                     <section key={day.date} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                       <div className={
//                         view === "grid"
//                           ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
//                           : "flex flex-col gap-4"
//                       }>
//                         {Array.isArray(day.jobs) && day.jobs.length > 0 ? (
//                           day.jobs.map((job) => (
//                             <JobCard
//                               key={job.id}
//                               job={job}
//                               onClick={() => handleJobClick(job)}
//                               view={view}
//                             />
//                           ))
//                         ) : (
//                           <div className="col-span-full text-center py-8 text-gray-500">
//                             <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                             <p>No jobs for this date.</p>
//                           </div>
//                         )}
//                       </div>
//                     </section>
//                   ))
//                 )}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

