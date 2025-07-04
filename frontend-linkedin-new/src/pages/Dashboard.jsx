// // // import React, { useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { useSelector, useDispatch } from "react-redux";
// // // import FilterBar from "../components/FilterBar";
// // // import DownloadButton from "../components/DownloadButton";
// // // import JobCard from "../components/JobCard";
// // // import { loadDummyJobs } from "../slices/jobsSlice";

// // // const Dashboard = () => {
// // //   const dispatch = useDispatch();
// // //   const navigate = useNavigate();
// // //   const jobs = useSelector(state => state.jobs.jobs);
// // //   const user = useSelector(state => state.user.user);
// // //   const [filters, setFilters] = React.useState({ type: "", category: "" });

// // //   useEffect(() => {
// // //     dispatch(loadDummyJobs());
// // //   }, [dispatch]);

// // //   const handleJobClick = (job) => {
// // //     navigate(`/jobs/${job.id}`, { state: { job } });
// // //   };

// // //   const handleFilterChange = (key, value) => {
// // //     setFilters((prev) => ({ ...prev, [key]: value }));
// // //   };

// // //   const handleDownload = () => {
// // //     alert("Download Excel triggered!");
// // //   };

// // //   const handleLogout = () => {
// // //     localStorage.removeItem('authToken');
// // //     localStorage.removeItem('authUser');
// // //     navigate("/login");
// // //   };

// // //   // Filter jobs based on filters
// // //   const filteredJobs = jobs.filter((job) => {
// // //     const typeMatch = !filters.type || (job.employment_type && job.employment_type.includes(filters.type));
// // //     const categoryMatch = !filters.category || (job.seniority === filters.category);
// // //     return typeMatch && categoryMatch;
// // //   });

// // //   // Extract unique job types and categories from jobs
// // //   const jobTypes = Array.from(new Set(jobs.flatMap(j => j.employment_type || []).filter(Boolean)));
// // //   const categories = Array.from(new Set(jobs.map(j => j.seniority).filter(Boolean)));

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 p-6">
// // //       <div className="max-w-6xl mx-auto">
// // //         <div className="flex items-center justify-between mb-6">
// // //           <div className="text-lg font-semibold text-gray-700">Welcome, {user?.name || user?.email}</div>
// // //           <button
// // //             onClick={handleLogout}
// // //             className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
// // //           >
// // //             Logout
// // //           </button>
// // //         </div>
// // //         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
// // //           <FilterBar
// // //             categories={categories}
// // //             jobTypes={jobTypes}
// // //             onFilterChange={handleFilterChange}
// // //           />
// // //           <DownloadButton onClick={handleDownload} />
// // //         </div>
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// // //           {filteredJobs.length === 0 ? (
// // //             <div className="col-span-full text-center text-gray-500">No jobs found.</div>
// // //           ) : (
// // //             filteredJobs.map((job) => (
// // //               <JobCard key={job.id} job={job} onClick={() => handleJobClick(job)} />
// // //             ))
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard; 

// // // //job title
// // // // job location 
// // // //job description


// // import React, { useState, useEffect } from 'react';
// // import './Dashboard.css';

// // const Dashboard = ({ username, onLogout }) => {
// //   const [jobs, setJobs] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [selectedJob, setSelectedJob] = useState(null);
// //   const [searchParams, setSearchParams] = useState({
// //     limit: '1',
    
// //       location_filter: '"United States" OR "United Kingdom"',

// //       advanced_title_filter: '(QA | \'Test Automation\' | \'Web Development\' | \'AI/ML\' | \'UI/UX\')'
// //   });

// //   // Get auth token from localStorage
// //   const getAuthToken = () => {
// //     return localStorage.getItem('token');
// //   };

// //   // Fetch jobs from API with authentication
// //   const fetchJobs = async () => {
// //     setLoading(true);
// //     setError('');
    
// //     try {
// //       const token = getAuthToken();
// //       const response = await fetch('http://localhost:3001/api/jobs', {
// //         method: 'POST',
// //         // headers: {
// //         //   'Content-Type': 'application/json',
// //         //   'Authorization': `Bearer ${token}`
// //         // },
// //         body: JSON.stringify(searchParams)
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to fetch jobs');
// //       }

// //       const result = await response.json();
// //       setJobs(result.jobs || []);
      
// //       // Save to MongoDB automatically after fetching
// //       await saveJobsToDatabase(result.jobs);
      
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Save jobs to MongoDB database
// //   const saveJobsToDatabase = async (jobsData) => {
// //     try {
// //       const token = getAuthToken();
// //       const response = await fetch('http://localhost:3001/api/save-jobs', {
// //         method: 'POST',
// //         // headers: {
// //         //   'Content-Type': 'application/json',
// //         //   'Authorization': `Bearer ${token}`
// //         // },
// //         body: JSON.stringify({ 
// //           jobs: jobsData,
// //           userId: username.id 
// //         })
// //       });

// //       if (!response.ok) {
// //         console.warn('Failed to save jobs to database');
// //       }
// //     } catch (err) {
// //       console.warn('Error saving to database:', err.message);
// //     }
// //   };

// //   // Download CSV file
// //   const downloadCSV = async () => {
// //     try {
// //       const token = getAuthToken();
// //       const response = await fetch('http://localhost:3001/api/download-csv', {
// //         // headers: {
// //         //   'Authorization': `Bearer ${token}`
// //         // }
// //       });

// //       if (!response.ok) {
// //         throw new Error('Failed to download CSV');
// //       }

// //       const blob = await response.blob();
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement('a');
// //       a.href = url;
// //       a.download = 'linkedin_jobs_complete.csv';
// //       document.body.appendChild(a);
// //       a.click();
// //       window.URL.revokeObjectURL(url);
// //       document.body.removeChild(a);
      
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };

// //   // Clear job data from frontend
// //   const clearData = () => {
// //     setJobs([]);
// //     setSelectedJob(null);
// //     setError('');
// //   };

// //   // Format date
// //   const formatDate = (dateString) => {
// //     if (!dateString) return 'N/A';
// //     return new Date(dateString).toLocaleDateString();
// //   };

// //   // Format salary
// //   const formatSalary = (salaryRaw) => {
// //     if (!salaryRaw?.value) return 'Not specified';
// //     const { minValue, maxValue, unitText } = salaryRaw.value;
// //     const currency = salaryRaw.currency || '';
    
// //     if (minValue && maxValue) {
// //       return `${currency}${minValue.toLocaleString()}-${maxValue.toLocaleString()}/${unitText || 'year'}`;
// //     }
// //     if (minValue) {
// //       return `${currency}${minValue.toLocaleString()}+/${unitText || 'year'}`;
// //     }
// //     return 'Not specified';
// //   };

// //   if (selectedJob) {
// //     return (
// //       <div className="dashboard-container">
// //         <div className="dashboard-header">
// //           <h1>Job Details</h1>
// //           <div className="header-actions">
// //             <button onClick={() => setSelectedJob(null)} className="btn btn-secondary">
// //               ← Back to Jobs
// //             </button>
// //             <button onClick={onLogout} className="btn btn-danger">
// //               Logout
// //             </button>
// //           </div>
// //         </div>

// //         <div className="job-detail">
// //           <div className="job-detail-header">
// //             <h2>{selectedJob.title}</h2>
// //             <div className="job-badges">
// //               {selectedJob.remote_derived && <span className="badge remote">Remote</span>}
// //               {selectedJob.employment_type && (
// //                 <span className="badge employment">
// //                   {Array.isArray(selectedJob.employment_type) 
// //                     ? selectedJob.employment_type.join(', ') 
// //                     : selectedJob.employment_type}
// //                 </span>
// //               )}
// //             </div>
// //           </div>

// //           <div className="job-info-grid">
// //             <div className="job-info-section">
// //               <h3>Job Information</h3>
// //               <div className="info-item">
// //                 <strong>Company:</strong> {selectedJob.organization || 'N/A'}
// //               </div>
// //               <div className="info-item">
// //                 <strong>Location:</strong> {selectedJob.locations_derived ? selectedJob.locations_derived.join(', ') : 'N/A'}
// //               </div>
// //               <div className="info-item">
// //                 <strong>Posted:</strong> {formatDate(selectedJob.date_posted)}
// //               </div>
// //               <div className="info-item">
// //                 <strong>Salary:</strong> {formatSalary(selectedJob.salary_raw)}
// //               </div>
// //               <div className="info-item">
// //                 <strong>Seniority:</strong> {selectedJob.seniority || 'N/A'}
// //               </div>
// //               <div className="info-item">
// //                 <strong>Industry:</strong> {selectedJob.linkedin_org_industry || 'N/A'}
// //               </div>
// //               <div className="info-item">
// //                 <strong>Company Size:</strong> {selectedJob.linkedin_org_size || 'N/A'}
// //               </div>
// //               {selectedJob.recruiter_name && (
// //                 <div className="info-item">
// //                   <strong>Recruiter:</strong> {selectedJob.recruiter_name}
// //                 </div>
// //               )}
// //             </div>

// //             <div className="job-description-section">
// //               <h3>Job Description</h3>
// //               <div className="description-content">
// //                 {selectedJob.description_text || 'No description available'}
// //               </div>
              
// //               {selectedJob.url && (
// //                 <div className="job-actions">
// //                   <a href={selectedJob.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
// //                     Apply on LinkedIn
// //                   </a>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="dashboard-container">
// //       <div className="dashboard-header">
// //         <div>
// //           {/* <h1>Welcome, {user.username}!</h1> */}
// //           <p>LinkedIn Job Search Dashboard</p>
// //         </div>
// //         <button onClick={onLogout} className="btn btn-danger">
// //           Logout
// //         </button>
// //       </div>

// //       <div className="search-section">
// //         <h3>Search Parameters</h3>
// //         <div className="search-form">
// //           <div className="form-group">
// //             <label>Location Filter:</label>
// //             <input
// //               type="text"
// //               value={searchParams.location_filter}
// //               onChange={(e) => setSearchParams(prev => ({
// //                 ...prev,
// //                 location_filter: e.target.value
// //               }))}
// //               placeholder="Dubai OR Ajman OR Sharjah"
// //             />
// //           </div>
          
// //           <div className="form-group">
// //             <label>Job Titles:</label>
// //             <input
// //               type="text"
// //               value={searchParams.advanced_title_filter}
// //               onChange={(e) => setSearchParams(prev => ({
// //                 ...prev,
// //                 advanced_title_filter: e.target.value
// //               }))}
// //               placeholder="(MERN | Flutter | SQA)"
// //             />
// //           </div>
          
// //           <div className="form-group">
// //             <label>Limit:</label>
// //             <input
// //               type="number"
// //               min="1"
// //               max="100"
// //               value={searchParams.limit}
// //               onChange={(e) => setSearchParams(prev => ({
// //                 ...prev,
// //                 limit: e.target.value
// //               }))}
// //             />
// //           </div>
// //         </div>
// //       </div>

// //       <div className="actions-section">
// //         <button 
// //           onClick={fetchJobs} 
// //           disabled={loading} 
// //           className="btn btn-primary"
// //         >
// //           {loading ? 'Fetching Jobs...' : 'Fetch Job Data'}
// //         </button>
        
// //         <button 
// //           onClick={downloadCSV} 
// //           disabled={jobs.length === 0} 
// //           className="btn btn-success"
// //         >
// //           Download CSV ({jobs.length} jobs)
// //         </button>
        
// //         <button 
// //           onClick={clearData} 
// //           disabled={jobs.length === 0} 
// //           className="btn btn-warning"
// //         >
// //           Clear Job Data
// //         </button>
// //       </div>

// //       {error && (
// //         <div className="error-message">
// //           {error}
// //         </div>
// //       )}

// //       {jobs.length > 0 && (
// //         <div className="jobs-section">
// //           <h3>Found {jobs.length} Jobs</h3>
// //           <div className="jobs-grid">
// //             {jobs.map((job) => (
// //               <div 
// //                 key={job.id} 
// //                 className="job-card" 
// //                 onClick={() => setSelectedJob(job)}
// //               >
// //                 <div className="job-card-header">
// //                   <h4>{job.title}</h4>
// //                   <div className="job-badges">
// //                     {job.remote_derived && <span className="badge remote">Remote</span>}
// //                   </div>
// //                 </div>
                
// //                 <div className="job-card-info">
// //                   <p><strong>Company:</strong> {job.organization}</p>
// //                   <p><strong>Location:</strong> {job.locations_derived ? job.locations_derived.join(', ') : 'N/A'}</p>
// //                   <p><strong>Posted:</strong> {formatDate(job.date_posted)}</p>
// //                   {job.salary_raw && (
// //                     <p><strong>Salary:</strong> {formatSalary(job.salary_raw)}</p>
// //                   )}
// //                 </div>
                
// //                 <div className="job-card-footer">
// //                   <span className="view-details">Click to view details →</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {jobs.length === 0 && !loading && (
// //         <div className="empty-state">
// //           <h3>No jobs found</h3>
// //           <p>Click "Fetch Job Data" to search for jobs</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Dashboard;
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import './Dashboard.css';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [searchParams, setSearchParams] = useState({
//     limit: '1',
    
//       location_filter: '"United States" OR "United Kingdom"',

//       advanced_title_filter: '(QA | \'Test Automation\' | \'Web Development\' | \'AI/ML\' | \'UI/UX\')'
//   });

//   // Safety check: Don't render if user is not loaded
//   if (!user) {
//     return (
//       <div className="dashboard-container">
//         <div className="loading-state">
//           <h2>Loading...</h2>
//           <p>Please wait while we load your dashboard.</p>
//         </div>
//       </div>
//     );
//   }

//   // Get auth token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem("authToken");
//   };

//   // Fetch jobs from API
//   const fetchJobs = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       console.log('🚀 Fetching jobs...');

//       const response = await fetch('http://localhost:3001/api/jobs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//           // No auth header needed since you removed middleware
//         },
//         body: JSON.stringify(searchParams)
//       });

//       console.log('Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch jobs');
//       }

//       const result = await response.json();
//       console.log('✅ Jobs received:', result);
      
//       if (result.success && result.jobs) {
//         setJobs(result.jobs);
        
//         // Auto-save to database after successful fetch
//         if (result.jobs.length > 0) {
//           await saveJobsToDatabase(result.jobs);
//         }
//       } else {
//         setError('No jobs found');
//       }
      
//     } catch (err) {
//       console.error('❌ Fetch jobs error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save jobs to database
//   const saveJobsToDatabase = async (jobsData) => {
//     if (!user || !user.id) {
//       console.error('❌ Cannot save: User or user ID is undefined');
//       setError('User not authenticated. Please login again.');
//       return;
//     }

//     setSaving(true);
    
//     try {
//       console.log('💾 Saving jobs to database for user:', user.id);
      
//       const token = getAuthToken();
      
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await fetch('http://localhost:3001/api/save-jobs', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ 
//           jobs: jobsData,
//           userId: user.id 
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to save jobs');
//       }

//       const result = await response.json();
//       console.log('✅ Jobs saved to database:', result);
      
//     } catch (error) {
//       console.error('❌ Error saving to database:', error);
//       // Don't show database save errors to user unless critical
//       console.warn('Database save failed, but jobs are still available in memory');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Download CSV file
//   const downloadCSV = async () => {
//     try {
//       const response = await fetch('http://localhost:3001/api/download-csv');

//       if (!response.ok) {
//         throw new Error('Failed to download CSV');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'linkedin_jobs_complete.csv';
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//       console.log('✅ CSV downloaded successfully');
      
//     } catch (err) {
//       console.error('❌ CSV download error:', err);
//       setError(err.message);
//     }
//   };

//   // Clear job data from frontend
//   const clearData = () => {
//     setJobs([]);
//     setSelectedJob(null);
//     setError('');
//     console.log('🗑️ Job data cleared from frontend');
//   };

//   // Manual save jobs (if user wants to save current jobs)
//   const handleManualSave = async () => {
//     if (jobs.length === 0) {
//       setError('No jobs to save');
//       return;
//     }
    
//     await saveJobsToDatabase(jobs);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch {
//       return dateString;
//     }
//   };

//   // Format salary
//   const formatSalary = (salaryRaw) => {
//     if (!salaryRaw?.value) return 'Not specified';
//     const { minValue, maxValue, unitText } = salaryRaw.value;
//     const currency = salaryRaw.currency || '';
    
//     if (minValue && maxValue) {
//       return `${currency}${minValue.toLocaleString()}-${maxValue.toLocaleString()}/${unitText || 'year'}`;
//     }
//     if (minValue) {
//       return `${currency}${minValue.toLocaleString()}+/${unitText || 'year'}`;
//     }
//     return 'Not specified';
//   };

//   // Handle logout
//   const handleLogout = () => {
//     try {
//       logout();
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // Job detail view
//   if (selectedJob) {
//     return (
//       <div className="dashboard-container">
//         <div className="dashboard-header">
//           <h1>Job Details</h1>
//           <div className="header-actions">
//             <button onClick={() => setSelectedJob(null)} className="btn btn-secondary">
//               ← Back to Jobs
//             </button>
//             <button onClick={handleLogout} className="btn btn-danger">
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="job-detail">
//           <div className="job-detail-header">
//             <h2>{selectedJob.title}</h2>
//             <div className="job-badges">
//               {selectedJob.remote_derived && <span className="badge remote">Remote</span>}
//               {selectedJob.employment_type && (
//                 <span className="badge employment">
//                   {Array.isArray(selectedJob.employment_type) 
//                     ? selectedJob.employment_type.join(', ') 
//                     : selectedJob.employment_type}
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="job-info-grid">
//             <div className="job-info-section">
//               <h3>Job Information</h3>
//               <div className="info-item">
//                 <strong>Company:</strong> {selectedJob.organization || 'N/A'}
//               </div>
//               <div className="info-item">
//                 <strong>Location:</strong> {selectedJob.locations_derived ? selectedJob.locations_derived.join(', ') : 'N/A'}
//               </div>
//               <div className="info-item">
//                 <strong>Posted:</strong> {formatDate(selectedJob.date_posted)}
//               </div>
//               <div className="info-item">
//                 <strong>Salary:</strong> {formatSalary(selectedJob.salary_raw)}
//               </div>
//               <div className="info-item">
//                 <strong>Seniority:</strong> {selectedJob.seniority || 'N/A'}
//               </div>
//               <div className="info-item">
//                 <strong>Industry:</strong> {selectedJob.linkedin_org_industry || 'N/A'}
//               </div>
//               <div className="info-item">
//                 <strong>Company Size:</strong> {selectedJob.linkedin_org_size || 'N/A'}
//               </div>
//               {selectedJob.recruiter_name && (
//                 <div className="info-item">
//                   <strong>Recruiter:</strong> {selectedJob.recruiter_name}
//                 </div>
//               )}
//             </div>

//             <div className="job-description-section">
//               <h3>Job Description</h3>
//               <div className="description-content">
//                 {selectedJob.description_text || 'No description available'}
//               </div>
              
//               {selectedJob.url && (
//                 <div className="job-actions">
//                   <a href={selectedJob.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
//                     Apply on LinkedIn
//                   </a>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main dashboard view
//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <div>
//           <h1>Welcome, {user.username}!</h1>
//           <p>LinkedIn Job Search Dashboard</p>
//         </div>
//         <button onClick={handleLogout} className="btn btn-danger">
//           Logout
//         </button>
//       </div>

//       <div className="search-section">
//         <h3>Search Parameters</h3>
//         <div className="search-form">
//           <div className="form-group">
//             <label>Location Filter:</label>
//             <input
//               type="text"
//               value={searchParams.location_filter}
//               onChange={(e) => setSearchParams(prev => ({
//                 ...prev,
//                 location_filter: e.target.value
//               }))}
//               placeholder="Dubai OR Ajman OR Sharjah"
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Job Titles:</label>
//             <input
//               type="text"
//               value={searchParams.advanced_title_filter}
//               onChange={(e) => setSearchParams(prev => ({
//                 ...prev,
//                 advanced_title_filter: e.target.value
//               }))}
//               placeholder="(MERN | Flutter | SQA)"
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Limit:</label>
//             <input
//               type="number"
//               min="1"
//               max="100"
//               value={searchParams.limit}
//               onChange={(e) => setSearchParams(prev => ({
//                 ...prev,
//                 limit: e.target.value
//               }))}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="actions-section">
//         <button 
//           onClick={fetchJobs} 
//           disabled={loading} 
//           className="btn btn-primary"
//         >
//           {loading ? 'Fetching Jobs...' : 'Fetch Job Data'}
//         </button>
        
//         <button 
//           onClick={handleManualSave} 
//           disabled={jobs.length === 0 || saving} 
//           className="btn btn-info"
//         >
//           {saving ? 'Saving...' : `Save ${jobs.length} Jobs to DB`}
//         </button>
        
//         <button 
//           onClick={downloadCSV} 
//           disabled={jobs.length === 0} 
//           className="btn btn-success"
//         >
//           Download CSV ({jobs.length} jobs)
//         </button>
        
//         <button 
//           onClick={clearData} 
//           disabled={jobs.length === 0} 
//           className="btn btn-warning"
//         >
//           Clear Job Data
//         </button>
//       </div>

//       {error && (
//         <div className="error-message">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {saving && (
//         <div className="info-message">
//           💾 Saving jobs to database...
//         </div>
//       )}

//       {jobs.length > 0 && (
//         <div className="jobs-section">
//           <h3>Found {jobs.length} Jobs</h3>
//           <div className="jobs-grid">
//             {jobs.map((job) => (
//               <div 
//                 key={job.id} 
//                 className="job-card" 
//                 onClick={() => setSelectedJob(job)}
//               >
//                 <div className="job-card-header">
//                   <h4>{job.title}</h4>
//                   <div className="job-badges">
//                     {job.remote_derived && <span className="badge remote">Remote</span>}
//                   </div>
//                 </div>
                
//                 <div className="job-card-info">
//                   <p><strong>Company:</strong> {job.organization}</p>
//                   <p><strong>Location:</strong> {job.locations_derived ? job.locations_derived.join(', ') : 'N/A'}</p>
//                   <p><strong>Posted:</strong> {formatDate(job.date_posted)}</p>
//                   {job.salary_raw && (
//                     <p><strong>Salary:</strong> {formatSalary(job.salary_raw)}</p>
//                   )}
//                 </div>
                
//                 <div className="job-card-footer">
//                   <span className="view-details">Click to view details →</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {jobs.length === 0 && !loading && (
//         <div className="empty-state">
//           <h3>No jobs found</h3>
//           <p>Click "Fetch Job Data" to search for jobs</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'saved'
  const [searchParams, setSearchParams] = useState({
    limit: '1',
    
      location_filter: '"United States" OR "United Kingdom"',

      advanced_title_filter: '(QA | \'Test Automation\' | \'Web Development\' | \'AI/ML\' | \'UI/UX\')'
  });

  // Safety check: Don't render if user is not loaded
  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <h2>Loading...</h2>
          <p>Please wait while we load your dashboard.</p>
        </div>
      </div>
    );
  }

  // Load saved jobs on component mount
  useEffect(() => {
    if (activeTab === 'saved') {
      getSavedJobs();
    }
  }, [activeTab, user.id]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Fetch jobs from API
  // const fetchJobs = async () => {
  //   setLoading(true);
  //   setError('');
  //   setSuccess('');
    
  //   try {
  //     console.log('🚀 Fetching jobs...');

  //     const response = await fetch('http://localhost:3001/api/jobs', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(searchParams)
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to fetch jobs');
  //     }

  //     const result = await response.json();
      
  //     if (result.success && result.jobs) {
  //       setJobs(result.jobs);
  //       setSuccess(`✅ Found ${result.jobs.length} jobs!`);
        
  //       // Auto-save to database after successful fetch
  //       if (result.jobs.length > 0) {
  //         await saveJobsToDatabase(result.jobs);
  //       }
  //     } else {
  //       setError('No jobs found');
  //     }
      
  //   } catch (err) {
  //     console.error('❌ Fetch jobs error:', err);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
// const fetchJobs = async () => {
//   setLoading(true);
//   setError('');
//   setSuccess('');
  
//   try {
//     console.log('🚀 Fetching jobs...');

//     const response = await fetch('http://localhost:3001/api/jobs', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         ...searchParams,
//         userId: user.id // Add userId to automatically save to database
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to fetch jobs');
//     }

//     const result = await response.json();
    
//     if (result.success && result.jobs) {
//       setJobs(result.jobs);
      
//       let successMessage = `✅ Found ${result.jobs.length} jobs!`;
//       if (result.csvFile) {
//         successMessage += ` CSV saved with 20 fields.`;
//       }
//       if (result.databaseSave) {
//         successMessage += ` ${result.databaseSave.savedCount} jobs saved to database.`;
//       }
      
//       setSuccess(successMessage);
//     } else {
//       setError('No jobs found');
//     }
    
//   } catch (err) {
//     console.error('❌ Fetch jobs error:', err);
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

  // Save jobs to database
  const saveJobsToDatabase = async (jobsData) => {
    setSaving(true);
    
    try {
      console.log('💾 Saving jobs to database for user:', user.id);
      
      const response = await fetch('http://localhost:3001/api/save-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          jobs: jobsData,
          userId: user.id 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save jobs');
      }

      const result = await response.json();
      console.log('✅ Jobs saved to database:', result);
      setSuccess(`💾 Saved ${result.savedCount} jobs to database`);
      
    } catch (error) {
      console.error('❌ Error saving to database:', error);
      setError(`Database save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Get saved jobs from database
  const getSavedJobs = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3001/api/saved-jobs?userId=${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get saved jobs');
      }

      const result = await response.json();
      setSavedJobs(result.jobs || []);
      
    } catch (error) {
      console.error('❌ Error getting saved jobs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Download CSV file
  const downloadCSV = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/download-csv');

      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'linkedin_jobs_complete.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess('✅ CSV downloaded successfully');
      
    } catch (err) {
      console.error('❌ CSV download error:', err);
      setError(err.message);
    }
  };

  const fetchJobs = async () => {
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    console.log('🚀 Fetching jobs with 20-field auto-save...');

    const response = await fetch('http://localhost:3001/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...searchParams,
        userId: user.id // Include userId for automatic database save
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch jobs');
    }

    const result = await response.json();
    
    if (result.success && result.jobs) {
      setJobs(result.jobs); // This now contains only 20 fields
      
      let successMessage = `✅ Found ${result.jobs.length} jobs with 20 fields!`;
      if (result.csvFile) {
        successMessage += ` CSV created.`;
      }
      if (result.databaseSave) {
        successMessage += ` ${result.databaseSave.savedCount} jobs saved to database.`;
      }
      
      setSuccess(successMessage);
    } else {
      setError('No jobs found');
    }
    
  } catch (err) {
    console.error('❌ Fetch jobs error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

// Fixed download function
const download20FieldsCSV = async () => {
  try {
    console.log('📥 Downloading 20-fields CSV...');
    
    const response = await fetch('http://localhost:3001/api/download-20-fields-csv');

    console.log('Download response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to download 20-fields CSV');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkedin_jobs_20_fields.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setSuccess('✅ 20-fields CSV downloaded successfully');
    
  } catch (err) {
    console.error('❌ 20-fields CSV download error:', err);
    setError(`Download failed: ${err.message}`);
  }
};
// / Add this function to your Dashboard component
// const download20FieldsCSV = async () => {
//   try {
//     const response = await fetch('http://localhost:3001/api/download-20-fields-csv');

//     if (!response.ok) {
//       throw new Error('Failed to download 20-fields CSV');
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'linkedin_jobs_20_fields.csv';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//     document.body.removeChild(a);
    
//     setSuccess('✅ 20-fields CSV downloaded successfully');
    
//   } catch (err) {
//     console.error('❌ 20-fields CSV download error:', err);
//     setError(err.message);
//   }
// };
  // Clear job data from frontend
  const clearData = () => {
    if (activeTab === 'search') {
      setJobs([]);
    } else {
      setSavedJobs([]);
    }
    setSelectedJob(null);
    setError('');
    setSuccess('🗑️ Data cleared from frontend');
  };

  // Clear all saved jobs from database
  const clearAllSavedJobs = async () => {
    if (!window.confirm('Are you sure you want to delete all saved jobs from database?')) {
      return;
    }

    setSaving(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/saved-jobs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to clear jobs');
      }

      const result = await response.json();
      setSavedJobs([]);
      setSuccess(`✅ ${result.message}`);
      
    } catch (error) {
      console.error('❌ Error clearing jobs:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete specific saved job
  const deleteSavedJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/saved-jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Remove from local state
      setSavedJobs(prev => prev.filter(job => job.jobId !== jobId));
      setSuccess('✅ Job deleted successfully');
      
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      setError(error.message);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/saved-jobs/${jobId}/bookmark`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }

      const result = await response.json();
      
      // Update local state
      setSavedJobs(prev => prev.map(job => 
        job.jobId === jobId ? { ...job, isBookmarked: result.isBookmarked } : job
      ));
      
      setSuccess(result.message);
      
    } catch (error) {
      console.error('❌ Error toggling bookmark:', error);
      setError(error.message);
    }
  };

  // Mark as applied
  const markAsApplied = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/saved-jobs/${jobId}/applied`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to mark as applied');
      }

      const result = await response.json();
      
      // Update local state
      setSavedJobs(prev => prev.map(job => 
        job.jobId === jobId ? { ...job, isApplied: true } : job
      ));
      
      setSuccess(result.message);
      
    } catch (error) {
      console.error('❌ Error marking as applied:', error);
      setError(error.message);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Format salary
  const formatSalary = (salaryRaw) => {
    if (!salaryRaw?.value) return 'Not specified';
    const { minValue, maxValue, unitText } = salaryRaw.value;
    const currency = salaryRaw.currency || '';
    
    if (minValue && maxValue) {
      return `${currency}${minValue.toLocaleString()}-${maxValue.toLocaleString()}/${unitText || 'year'}`;
    }
    if (minValue) {
      return `${currency}${minValue.toLocaleString()}+/${unitText || 'year'}`;
    }
    return 'Not specified';
  };

  // Handle logout
  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Job detail view
  if (selectedJob) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Job Details</h1>
          <div className="header-actions">
            <button onClick={() => setSelectedJob(null)} className="btn btn-secondary">
              ← Back to Jobs
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>

        <div className="job-detail">
          <div className="job-detail-header">
            <h2>{selectedJob.title}</h2>
            <div className="job-badges">
              {selectedJob.remote_derived && <span className="badge remote">Remote</span>}
              {selectedJob.employment_type && (
                <span className="badge employment">
                  {Array.isArray(selectedJob.employment_type) 
                    ? selectedJob.employment_type.join(', ') 
                    : selectedJob.employment_type}
                </span>
              )}
              {selectedJob.isBookmarked && <span className="badge bookmarked">⭐ Bookmarked</span>}
              {selectedJob.isApplied && <span className="badge applied">✅ Applied</span>}
            </div>
          </div>

          <div className="job-info-grid">
            <div className="job-info-section">
              <h3>Job Information</h3>
              <div className="info-item">
                <strong>Company:</strong> {selectedJob.organization || 'N/A'}
              </div>
              <div className="info-item">
                <strong>Location:</strong> {selectedJob.locations_derived ? selectedJob.locations_derived.join(', ') : 'N/A'}
              </div>
              <div className="info-item">
                <strong>Posted:</strong> {formatDate(selectedJob.date_posted)}
              </div>
              <div className="info-item">
                <strong>Salary:</strong> {formatSalary(selectedJob.salary_raw)}
              </div>
              <div className="info-item">
                <strong>Seniority:</strong> {selectedJob.seniority || 'N/A'}
              </div>
              <div className="info-item">
                <strong>Industry:</strong> {selectedJob.linkedin_org_industry || 'N/A'}
              </div>
              <div className="info-item">
                <strong>Company Size:</strong> {selectedJob.linkedin_org_size || 'N/A'}
              </div>
              {selectedJob.recruiter_name && (
                <div className="info-item">
                  <strong>Recruiter:</strong> {selectedJob.recruiter_name}
                </div>
              )}
            </div>

            <div className="job-description-section">
              <h3>Job Description</h3>
              <div className="description-content">
                {selectedJob.description_text || 'No description available'}
              </div>
              
              <div className="job-actions">
                {selectedJob.url && (
                  <a href={selectedJob.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Apply on LinkedIn
                  </a>
                )}
                
                {activeTab === 'saved' && (
                  <>
                    <button 
                      onClick={() => toggleBookmark(selectedJob.jobId)} 
                      className={`btn ${selectedJob.isBookmarked ? 'btn-warning' : 'btn-outline'}`}
                    >
                      {selectedJob.isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
                    </button>
                    
                    {!selectedJob.isApplied && (
                      <button 
                        onClick={() => markAsApplied(selectedJob.jobId)} 
                        className="btn btn-success"
                      >
                        Mark as Applied
                      </button>
                    )}
                    
                    <button 
                      onClick={() => deleteSavedJob(selectedJob.jobId)} 
                      className="btn btn-danger"
                    >
                      Delete Job
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>LinkedIn Job Search Dashboard</p>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          onClick={() => setActiveTab('search')} 
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
        >
          🔍 Search Jobs
        </button>
        <button 
          onClick={() => setActiveTab('saved')} 
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
        >
          💾 Saved Jobs
        </button>
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <>
          <div className="search-section">
            <h3>Search Parameters</h3>
            <div className="search-form">
              <div className="form-group">
                <label>Location Filter:</label>
                <input
                  type="text"
                  value={searchParams.location_filter}
                  onChange={(e) => setSearchParams(prev => ({
                    ...prev,
                    location_filter: e.target.value
                  }))}
                  placeholder="Dubai OR Ajman OR Sharjah"
                />
              </div>
              
              <div className="form-group">
                <label>Job Titles:</label>
                <input
                  type="text"
                  value={searchParams.advanced_title_filter}
                  onChange={(e) => setSearchParams(prev => ({
                    ...prev,
                    advanced_title_filter: e.target.value
                  }))}
                  placeholder="(MERN | Flutter | SQA)"
                />
              </div>
              
              <div className="form-group">
                <label>Limit:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={searchParams.limit}
                  onChange={(e) => setSearchParams(prev => ({
                    ...prev,
                    limit: e.target.value
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="actions-section">
            <button 
              onClick={fetchJobs} 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Fetching Jobs...' : 'Fetch Job Data'}
            </button>
            <button 
  onClick={download20FieldsCSV} 
  disabled={jobs.length === 0} 
  className="btn btn-info"
>
  Download 20-Field CSV ({jobs.length} jobs)
</button>
            <button 
              onClick={downloadCSV} 
              disabled={jobs.length === 0} 
              className="btn btn-success"
            >
              Download CSV ({jobs.length} jobs)
            </button>
            
            <button 
              onClick={clearData} 
              disabled={jobs.length === 0} 
              className="btn btn-warning"
            >
              Clear Data
            </button>
          </div>
        </>
      )}

      {/* Saved Jobs Tab */}
      {activeTab === 'saved' && (
        <div className="actions-section">
          <button 
            onClick={getSavedJobs} 
            disabled={loading} 
            className="btn btn-primary"
          >
            {loading ? 'Loading...' : 'Refresh Saved Jobs'}
          </button>
          
          <button 
            onClick={clearAllSavedJobs} 
            disabled={savedJobs.length === 0 || saving} 
            className="btn btn-danger"
          >
            {saving ? 'Clearing...' : 'Clear All Saved Jobs'}
          </button>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {saving && (
        <div className="info-message">
          💾 Processing...
        </div>
      )}

      {/* Jobs Display */}
      {activeTab === 'search' && jobs.length > 0 && (
        <div className="jobs-section">
          <h3>Found {jobs.length} Jobs</h3>
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => setSelectedJob(job)}
                showActions={false}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'saved' && savedJobs.length > 0 && (
        <div className="jobs-section">
          <h3>Saved Jobs ({savedJobs.length})</h3>
          <div className="jobs-grid">
            {savedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onClick={() => setSelectedJob(job)}
                showActions={true}
                onBookmark={() => toggleBookmark(job.jobId)}
                onApply={() => markAsApplied(job.jobId)}
                onDelete={() => deleteSavedJob(job.jobId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'search' && jobs.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No jobs found</h3>
          <p>Click "Fetch Job Data" to search for jobs</p>
        </div>
      )}

      {activeTab === 'saved' && savedJobs.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No saved jobs</h3>
          <p>Search for jobs and they will be automatically saved here</p>
        </div>
      )}
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onClick, showActions, onBookmark, onApply, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatSalary = (salaryRaw) => {
    if (!salaryRaw?.value) return 'Not specified';
    const { minValue, maxValue, unitText } = salaryRaw.value;
    const currency = salaryRaw.currency || '';
    
    if (minValue && maxValue) {
      return `${currency}${minValue.toLocaleString()}-${maxValue.toLocaleString()}/${unitText || 'year'}`;
    }
    if (minValue) {
      return `${currency}${minValue.toLocaleString()}+/${unitText || 'year'}`;
    }
    return 'Not specified';
  };

  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-card-header">
        <h4>{job.title}</h4>
        <div className="job-badges">
          {job.remote_derived && <span className="badge remote">Remote</span>}
          {job.isBookmarked && <span className="badge bookmarked">⭐</span>}
          {job.isApplied && <span className="badge applied">✅</span>}
        </div>
      </div>
      
      <div className="job-card-info">
        <p><strong>Company:</strong> {job.organization}</p>
        <p><strong>Location:</strong> {job.locations_derived ? job.locations_derived.join(', ') : 'N/A'}</p>
        <p><strong>Posted:</strong> {formatDate(job.date_posted)}</p>
        {job.salary_raw && (
          <p><strong>Salary:</strong> {formatSalary(job.salary_raw)}</p>
        )}
      </div>
      
      {showActions && (
        <div className="job-card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => onBookmark()} 
            className={`btn-small ${job.isBookmarked ? 'bookmarked' : ''}`}
            title="Bookmark"
          >
            {job.isBookmarked ? '⭐' : '☆'}
          </button>
          
          {!job.isApplied && (
            <button 
              onClick={() => onApply()} 
              className="btn-small apply"
              title="Mark as Applied"
            >
              ✓
            </button>
          )}
          
          <button 
            onClick={() => onDelete()} 
            className="btn-small delete"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      
      <div className="job-card-footer">
        <span className="view-details">Click to view details →</span>
      </div>
    </div>
  );
};

export default Dashboard;
