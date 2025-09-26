
import React, { useEffect, useState, useMemo } from "react";
import SidebarFilters from "../components/SidebarFilters";
import UpworkJobCard from "../components/UpworkJobCard";
import Header from "../components/Header";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectStatusOptions, selectPipeline } from "../slices/userSlice";
import { fetchUpworkJobsByDateThunk } from "../slices/jobsSlice";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateUpworkJobStatusThunk, upworkfetchJobByIdThunk, updateUpworkJobStatusNewThunk } from "../slices/jobsSlice";
import { logoutUser } from "../api/authApi";
// import { persistor } from './store';
import { setRange, resetJobsByDate } from "../slices/jobsSlice";
import { Calendar, Grid3X3, List, Kanban, Users, AlertCircle, Briefcase, Building2, Filter, Download, Search, ChevronDown, Eye, BarChart3, X } from 'lucide-react';
import { fetchCompanyPipelineThunk } from "../slices/userSlice";

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

const upworkJobTypeOptions = [
  { value: "", label: "All" },
  { value: "FIXED", label: "Fixed" },
  { value: "HOURLY", label: "Hourly" },
];

const colors = ["Yellow", "Green", "Red"];

// Enhanced status configuration with colors
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
// Utility to debounce functions
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}



// Utility function for safe storage (added fix)
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("Storage quota exceeded. Skipping localStorage set for", key);
      // Optional: Clear old data, e.g., localStorage.removeItem('someOldKey');
    } else {
      throw e;
    }
  }
}

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
  const { upworkJobsByDate, loading, error, range } = useSelector(state => state.jobs);
  const [dateRange, setDateRange] = useState(range);
  const [kanbanView, setKanbanView] = useState(false);
  const [kanbanJobs, setKanbanJobs] = useState({});
  const [kanbanLoading, setKanbanLoading] = useState(false);
  const [kanbanError, setKanbanError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState(new Set());
  const [failedUpdates, setFailedUpdates] = useState(new Map());
  const user = useSelector((state) => state.user.user);
  const statusOptions = useSelector(selectStatusOptions) || [];
  const pipeline = useSelector(selectPipeline);
  // const authInitializing = useSelector(selectAuthInitializing);
  const pipelineLoading = useSelector((state) => state.user.pipelineLoading);
  const [pipelineRequested, setPipelineRequested] = useState(false);
  const [triedRange, setTriedRange] = useState({}); // e.g., { '1d': true, '7d': true }
  // Ensure pipeline is loaded on mount
  useEffect(() => {
    if (!pipelineRequested && statusOptions.length === 0) {
      setPipelineRequested(true);
      dispatch(fetchCompanyPipelineThunk());
    }
  }, [dispatch, statusOptions.length, pipelineRequested]);

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
  const allJobs = upworkJobsByDate.flatMap(day => day.jobs || []);



  const location = useLocation();
  const navigate = useNavigate();

  // Parse filters from URL
  const getFiltersFromUrl = () => {
    const params = queryString.parse(location.search, { arrayFormat: 'bracket' });
    return {
      ...defaultFilters,
      ...params,
      country: params.country ? (Array.isArray(params.country) ? params.country : [params.country]) : [],
      category: params.category ? (Array.isArray(params.category) ? params.category : [params.category]) : [],
      color: Array.isArray(params.color) ? params.color[0] : (params.color || ""),
      type: params.type ? (Array.isArray(params.type) ? params.type : [params.type]) : [],
    };
  };

  const [filters, setFilters] = React.useState(getFiltersFromUrl());

  // Filtering logic
  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // keep your existing filter body unchanged
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
        if (weeks === null || weeks === undefined) group = "less_than_1";
        else if (weeks < 4) group = "less_than_1";
        else if (weeks >= 4 && weeks < 13) group = "1_3";
        else if (weeks >= 13 && weeks < 25) group = "3_6";
        else if (weeks >= 25) group = "more_6";
        if (filters.projectLength !== group) return false;
      }

      if (filters.hoursPerWeek) {
        const minHours = job.minHoursWeek;
        let group = "";
        if (minHours === null || minHours === undefined) group = "not_given";
        else if (minHours <= 30) group = "less_30";
        else if (minHours > 30) group = "more_30";
        if (filters.hoursPerWeek !== group) return false;
      }

      if (filters.jobDuration) {
        const isContractToHire = job.isContractToHire;
        let group = isContractToHire === true ? "contract_to_hire" : "not_given";
        if (filters.jobDuration !== group) return false;
      }

      const colorValue = job.tier || job.tierColor;
      if (filters.color && filters.color !== "" && colorValue !== filters.color) return false;

      return true;
    });
  }, [allJobs, filters]);

  // Debounced version
  const debouncedFetch = debounce((params) => {
    dispatch(fetchUpworkJobsByDateThunk(params));
  }, 300); // 300ms delay


  useEffect(() => {
    if (!kanbanView) return;
    const grouped = {};
    statusOrder.forEach(status => {
      grouped[status] = filteredJobs.filter(job => job.currentStatus === status);
    });
    setKanbanJobs(grouped);
  }, [kanbanView, filteredJobs]);



// Use groupedJobs directly instead of setting with setState.


  const onDragEnd = async (result) => {

    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    const job = kanbanJobs[sourceStatus][source.index];
    if (!job) return;

    // const updateId = `${job.jobId || job._id || job.id}-${Date.now()}`;
    const companyJobId = job._id; // company job id required by API
    if (!companyJobId) {
      setKanbanError('This job has no valid _id. Cannot update status.');
      return;
    }

    const updateId = `${companyJobId}-${Date.now()}`;

    // Clear any previous errors for this job
    setKanbanError(null);

    // Store original state for potential reversion
    const originalKanbanJobs = { ...kanbanJobs };
    const originalJobStatus = job.currentStatus;

    // IMMEDIATE UI UPDATE (Optimistic)
    const newKanbanJobs = { ...kanbanJobs };
    newKanbanJobs[sourceStatus] = Array.from(newKanbanJobs[sourceStatus]);
    newKanbanJobs[sourceStatus].splice(source.index, 1);
    newKanbanJobs[destStatus] = Array.from(newKanbanJobs[destStatus]);

    const updatedJob = {
      ...job,
      currentStatus: destStatus,
      isUpdating: true,
      updateId: updateId
    };
    newKanbanJobs[destStatus].splice(destination.index, 0, updatedJob);

    // Update UI immediately
    setKanbanJobs(newKanbanJobs);
    setOptimisticUpdates(prev => new Set(prev).add(updateId));

    try {
      await dispatch(updateUpworkJobStatusNewThunk({
        jobId: companyJobId,
        status: destStatus,
      })).unwrap();

      // Success - remove updating indicator
      setKanbanJobs(prevJobs => {
        const updatedJobs = { ...prevJobs };
        Object.keys(updatedJobs).forEach(status => {
          updatedJobs[status] = updatedJobs[status].map(j =>
            j.updateId === updateId
              ? { ...j, isUpdating: false, updateId: undefined }
              : j
          );
        });
        return updatedJobs;
      });

      setOptimisticUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateId);
        return newSet;
      });

      // Refetch jobs to update Redux and Kanban columns
      await dispatch(fetchUpworkJobsByDateThunk({ range: dateRange || '1d' }));

    } catch (err) {
      console.error('Failed to update job status:', err);

      // REVERT UI on failure
      setKanbanJobs(originalKanbanJobs);

      // Show error with job details
      setKanbanError(`Failed to move "${job.title}" to ${statusLabels[destStatus]}. Please try again.`);

      // Track failed update
      setFailedUpdates(prev => new Map(prev).set(job._id, {
        jobTitle: job.title,
        fromStatus: originalJobStatus,
        toStatus: destStatus,
        timestamp: Date.now()
      }));


      // Remove from optimistic updates
      setOptimisticUpdates(prev => {
        const newSet = new Set(prev);
        newSet.delete(updateId);
        return newSet;
      });

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setKanbanError(null);
        setFailedUpdates(prev => {
          const newMap = new Map(prev);
          newMap.delete(job.jobId || job._id || job.id);
          return newMap;
        });
      }, 5000);
    }
  };




  // Keep filters in sync with URL
  useEffect(() => {
    setFilters(getFiltersFromUrl());
  }, [location.search]);

  useEffect(() => {
    dispatch(fetchCompanyPipelineThunk())

  }, [])

  // Fetch jobs on mount (or when empty) with current range
  // useEffect(() => {
  //   if (!upworkJobsByDate || upworkJobsByDate.length === 0 || upworkJobsByDate.every(day => !day.jobs || day.jobs.length === 0)) {
  //     dispatch(fetchUpworkJobsByDateThunk({ range: dateRange || '1d', page: 1 }));
  //   }
  // }, [dispatch, upworkJobsByDate, dateRange]);

  // Flatten jobs for filtering

  const levels = Array.from(new Set(allJobs.map(j => j.level).filter(Boolean)));
  const countries = Array.from(new Set(allJobs.map(j => j.country).filter(Boolean)));
  const categories = Array.from(new Set(allJobs.map(j => j.category).filter(Boolean)));
  const paymentVerified = [true, false];
  const clientHistory = [1, 10, 100];
  const projectLength = [1, 3, 6, 13, 25];
  const hoursPerWeek = [30, 40, 50];
  const jobDuration = ["contract_to_hire", "not_given"];
  const jobTypes = ["Full Time", "Part Time", "Contract", "Freelance"];




  // Calculate total jobs for stats
  const totalJobs = allJobs.length;
  const jobStats = statusOrder.reduce((acc, status) => { acc[status] = allJobs.filter(job => job.currentStatus === status).length; return acc; }, {});

  // after filteredJobs and jobStats
  const [page, setPage] = useState(1);
  const [hasMoreLocal, setHasMoreLocal] = useState(true);
  const observer = React.useRef(null);

  // useEffect(() => {
  //   // Reset page and data when range changes
  //   setPage(1);
  //   setHasMoreLocal(true);
  //   dispatch(resetJobsByDate()); // Reset the Redux state
  //   dispatch(fetchUpworkJobsByDateThunk({ range: dateRange || '1d', page: 1, limit: 20 }));
  // }, [dateRange, dispatch]);

  // Update the useEffect for pagination

  // // Effect for dateRange change (add loading/data check)
  // useEffect(() => {
  //   if (loading || (upworkJobsByDate.length > 0 && dateRange === range)) return; // Skip if loading or data exists for this range
  //   setPage(1);
  //   setHasMoreLocal(true);
  //   dispatch(resetJobsByDate());
  //   debouncedFetch({ range: dateRange || '1d', page: 1, limit: 100 });
  // }, [dateRange, dispatch, loading, upworkJobsByDate.length, range]);
  useEffect(() => {
    if (!dateRange) return;
    if (triedRange[dateRange]) return; // already attempted this range; don't re-hit
    if (loading) return;
  
    setPage(1);
    setHasMoreLocal(true);
    dispatch(resetJobsByDate());
    debouncedFetch({ range: dateRange || '1d', page: 1, limit: 100 });
  
    // mark tried so we won't refetch repeatedly for the same range
    setTriedRange(prev => ({ ...prev, [dateRange]: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, loading, dispatch]);


  // useEffect(() => {
  //   if (page > 1 && hasMoreLocal) {
  //     dispatch(fetchUpworkJobsByDateThunk({ range: dateRange || '1d', page, limit: 20 }));
  //   }
  // }, [page, dateRange, dispatch, hasMoreLocal]);

  // Effect for pagination (add loading/hasMore check)
  useEffect(() => {
    if (page > 1 && hasMoreLocal && !loading) {
      debouncedFetch({ range: dateRange || '1d', page, limit: 100 });
    }
  }, [page, dateRange, dispatch, hasMoreLocal, loading]);

  // Update the lastJobRef callback
  const lastJobRef = React.useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreLocal && !loading) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMoreLocal]);

  // Update the handleDateRangeChange function
  const handleDateRangeChange = (e) => {
    const value = e.target.value;
    setDateRange(value);
    dispatch(setRange(value));
    setPage(1);
    setHasMoreLocal(true);
    dispatch(resetJobsByDate());
    dispatch(fetchUpworkJobsByDateThunk({ range: value, page: 1, limit: 100 }));
  };

  const handleExport = () => {
    alert("Exporting jobs...");
  };

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

  const handleLogout = () => {
    logoutUser(dispatch);
    navigate("/login");

  };

  const retryFailedUpdate = async (jobId) => {
    const failedUpdate = failedUpdates.get(jobId);
    if (!failedUpdate) return;

    const job = Object.values(kanbanJobs).flat().find(j => j._id === jobId);
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
    const currentIndex = kanbanJobs[currentStatus].findIndex(j => j._id === jobId);

    if (currentIndex !== -1) {
      fakeResult.source = { droppableId: currentStatus, index: currentIndex };
      await onDragEnd(fakeResult);
    }
  };

  useEffect(() => {
    // Initial fetch only if no data
    if (!loading && upworkJobsByDate.length === 0) {
      // Before dispatch
      console.log(`Fetching jobs: range=${dateRange}, page=${page}`);

      dispatch(fetchUpworkJobsByDateThunk({ range: dateRange || '1d', page: 1, limit: 100 }));
    }
  }, []); // Empty deps: runs once on mount


  useEffect(() => {
    // Check if we have more jobs based on the current data
    const totalJobs = upworkJobsByDate.flatMap(day => day.jobs || []).length;
    const expectedJobs = page * 100; // Assuming limit is 20

    // If we got fewer jobs than expected, we've reached the end
    if (totalJobs < expectedJobs && page > 1) {
      setHasMoreLocal(false);
    }
  }, [upworkJobsByDate, page]);

  useEffect(() => {
    if (upworkJobsByDate.length > 0) {
      // Trim data before storing to reduce size (added best practice)
      const trimmedData = upworkJobsByDate.map(group => ({
        date: group.date,
        jobs: group.jobs.map(job => ({
          id: job._id || job.jobId, // Minimal fields to avoid quota issues
          title: job.title,
          status: job.currentStatus
          // Add only essential fields; fetch full details on demand
        }))
      }));

      // Log size for debugging (best practice)
      const dataString = JSON.stringify(trimmedData);
      console.log('Data size to store:', dataString.length);

      // Safe storage (added fix)
      safeSetItem('upworkJobsByDate', dataString);
    }
  }, [upworkJobsByDate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <Header source="upwork" onExport={handleExport} user={user} onLogout={handleLogout} hideDownloadExcel />
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
                paymentVerified={paymentVerified}
                clientHistory={clientHistory}
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
                    className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${!kanbanView
                        ? "bg-white text-green-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                        }`}
                      onClick={() => setKanbanView(false)}
                    >
                      <Eye className="h-4 w-4" />
                      List/Grid
                    </button>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${kanbanView
                        ? "bg-white text-green-600 shadow-sm"
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
             
              </div>

              {/* Pipeline loader */}
              {(!pipeline ) && (
                <div className="mt-2 mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-600 border-top-transparent rounded-full animate-spin"></div>
                    <span className="text-green-700 text-sm">Loading pipeline...</span>
                  </div>
                </div>
              )}

              {/* Kanban User Selection */}
              {kanbanView && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-sm text-green-800">
                  Drag and drop cards between columns to update status.
                </div>
              )}
            </div>

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
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-green-700 text-sm">
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
                                  transition-all duration-200 ${snapshot.isDraggingOver ? 'ring-2 ring-green-400 ring-opacity-50' : ''}
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
                                        key={job._id}
                                        draggableId={String(job._id)}
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
                                              ${snapshot.isDragging ? 'shadow-lg rotate-1 ring-2 ring-green-400' : ''}
                                              ${job.isUpdating ? 'opacity-75' : ''}
                                            `}
                                          >
                                            {/* Real-time update indicator */}
                                            {job.isUpdating && (
                                              <div className="absolute top-2 right-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                              </div>
                                            )}

                                            {/* Failed update indicator */}
                                            {failedUpdates.has(job.jobId || job.id) && (
                                              <div className="absolute top-2 right-2">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    retryFailedUpdate(job.jobId || job.id);
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
                                                {(() => {
                                                  const c = job.company;
                                                  if (typeof c === 'string') return c;
                                                  if (c && typeof c === 'object') {
                                                    return c.name || c.companyName || c.title || job.companyName || 'Company';
                                                  }
                                                  return job.companyName || 'Company';
                                                })()}
                                              </p>
                                            </div>
                                            {/* <div className="flex items-center gap-2 mb-2">
                                              <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                              <p className="text-gray-600 text-sm truncate">
                                                {job.company || job.companyName}
                                              </p>
                                            </div> */}
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
              </div>
            ) : (
              // Enhanced List/Grid View
              <div className="space-y-6">
                {loading && upworkJobsByDate.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                  </div>


                ) : error ? (
                  <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span>{error}</span>
                    </div>
                  </div>
                ) : upworkJobsByDate.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                      {filteredJobs.map(job => (
                        <UpworkJobCard key={job._id || job.jobId || job.id} job={job} />
                      ))}
                    </div>

                    {/* Sentinel for lazy loading */}
                    {!kanbanView && filteredJobs.length > 0 && (
                      <div ref={lastJobRef} className="h-1 w-full" />
                    )}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UpworkDashboard;
