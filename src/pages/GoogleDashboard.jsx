
// import React, { useEffect, useState } from "react";


// import { useDispatch, useSelector } from "react-redux";
// import { fetchGoogleFileJobsThunk } from "../slices/jobsSlice";
// import GoogleJobCard from "../components/GoogleJobCard";

// const GoogleDashboard = () => {
//   const dispatch = useDispatch();
//   const { googleFileJobsByDate, googleFileLoading, googleFileError } = useSelector((state) => state.jobs);

//   const [view, setView] = useState("grid"); // Toggle between "grid" and "list" views

//   useEffect(() => {
//     dispatch(fetchGoogleFileJobsThunk());
//   }, [dispatch]);

//   if (googleFileLoading) {
//     return <div>Loading Google jobs...</div>;
//   }

//   if (googleFileError) {
//     return <div>Error: {googleFileError}</div>;
//   }

//   if (!googleFileJobsByDate || googleFileJobsByDate.length === 0) {
//     return <div>No jobs found</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       <div className="flex justify-end mb-4">
//         <button
//           className={`px-4 py-2 rounded-md text-sm font-medium ${
//             view === "grid" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//           }`}
//           onClick={() => setView("grid")}
//         >
//           Grid View
//         </button>
//         <button
//           className={`ml-2 px-4 py-2 rounded-md text-sm font-medium ${
//             view === "list" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
//           }`}
//           onClick={() => setView("list")}
//         >
//           List View
//         </button>
//       </div>

//       <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
//         {googleFileJobsByDate.map((group) =>
//           group.jobs.map((job) => <GoogleJobCard key={job._id} job={job} view={view} />)
//         )}
//       </div>
//     </div>
//   );
// };

// export default GoogleDashboard;



import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoogleJobsByDateThunk } from "../slices/jobsSlice";
import GoogleJobCard from "../components/GoogleJobCard";
import Header from "../components/Header";
import { AlertCircle, Search, Grid3X3, List, Filter, Calendar, Briefcase } from "lucide-react";
// import { logout } from "../slices/userSlice";
import { logoutUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const GoogleDashboard = () => {
  const dispatch = useDispatch();
  // const loading = useSelector(s => s.jobs.googleFileLoading);
  // const error = useSelector(s => s.jobs.googleFileError);
  const user = useSelector((state) => state.user.user); 
  const navigate = useNavigate();
  // Prefer file jobs; future-proof fallback to platform groups if added later
  const fileGroups = useSelector(s => s.jobs.googleFileJobsByDate || []);
  // const groups = fileGroups;

  const [view, setView] = useState("grid"); // "grid" | "list"
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { googleJobsByDate: groups, googleLoading: loading, googleError: error } = useSelector(state => state.jobs);


  const handleExport = () => {
    alert("Exporting jobs...");
  };
  const handleLogout = () => {
    logoutUser(dispatch);
    navigate("/login");

  };

  // const handleLogout = () => {
  //   dispatch(logout());
  // };

  useEffect(() => {
    dispatch(fetchGoogleJobsByDateThunk());
  }, [dispatch]);
  

  const allJobs = useMemo(
    () => (Array.isArray(groups) ? groups.flatMap(d => d.jobs || []) : []),
    [groups]
  );

  // const nonEmptyDays = useMemo(
  //   () => (Array.isArray(groups) ? groups : [])
  //     .map(d => ({ date: d.date, jobs: (d.jobs || []) }))
  //     .filter(d => Array.isArray(d.jobs) && d.jobs.length > 0),
  //   [groups]
  // );

  
// If you had a fallback like fileGroups vs platformGroups, simplify to only platform groups:
const nonEmptyDays = Array.isArray(groups) ? groups.filter(g => Array.isArray(g.jobs) && g.jobs.length > 0) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
       <Header
         source="google"
         onRefreshJobs={() => dispatch(fetchGoogleJobsByDateThunk())} hideDownloadExcel onExport={handleExport} user={user} onLogout={handleLogout}
      />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h1 className="text-lg font-semibold text-gray-900">Google Jobs</h1>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                aria-label="Grid view"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setView("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </button>
              <button
                aria-label="List view"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setView("list")}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

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
              <p className="text-gray-600">Check back later.</p>
            </div>
          ) : (
            nonEmptyDays.map(day => (
              <section key={day.date} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
                  {Array.isArray(day.jobs) && day.jobs.length > 0 ? (
                    day.jobs.map(job => (
                      <GoogleJobCard key={job._id} job={job} view={view} />
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
        </div>
      </div>
    </div>
  );
};

export default GoogleDashboard;