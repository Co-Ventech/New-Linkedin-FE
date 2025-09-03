// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";

// import {
//   fetchUpworkJobsByDateThunk, updateUpworkJobStatusThunk, updateUpworkAeCommentThunk, addUpworkJobCommentThunk, upworkfetchJobByIdThunk, updateUpworkAeScoreThunk,
//   updateUpworkAePitchedThunk, updateUpworkEstimatedBudgetThunk, generateUpworkProposalThunk, updateUpworkProposalThunk, setUpworkProposalLoading, updateJobStatusNewThunk, updateUpworkJobStatusNewThunk
// } from "../slices/jobsSlice";
// import axios from "axios";


// // import { updateUpworkAeCommentThunk, updateUpworkJobStatusThunk, addUpworkJobCommentThunk } from "../slices/jobsSlice";
// // await dispatch(updateUpworkJobStatusThunk({ jobId: job.id, status: ..., username:  }))
// // const dispatch = useDispatch();

// const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
// const PORT = import.meta.env.VITE_PORT;

// const STATUS_OPTIONS = [
//   'not_engaged', 'applied', 'engaged', 'interview', 'offer', 'rejected', 'onboard'
// ];

// const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];

// const UPWORK_SERVICE_CATEGORIES = [
//   "AI/ML",
//   "QA",
//   "Software Development",
//   "Mobile App Development",
//   "UI/UX",
//   "DevOps",
//   "Cloud DevOps",
//   "VAPT",
//   "Cybersecurity",
//   "Data Engineering"
// ];

// const badgeClass = {
//   tier: {
//     Yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400',
//     Green: 'bg-green-200 text-green-800 border-green-400',
//     Red: 'bg-red-200 text-red-800 border-red-400',
//     Default: 'bg-gray-200 text-gray-700 border-gray-300',
//   },
//   jobType: 'bg-blue-100 text-blue-800 border-blue-300',
//   occupation: 'bg-indigo-100 text-indigo-800 border-indigo-300',
// };


// const getKpiBadge = (score) => {
//   if (typeof score !== 'number') score = parseFloat(score);
//   if (isNaN(score)) return { color: 'bg-gray-200 text-gray-700 border-gray-300', tag: '' };
//   if (score >= 0.7) return { color: 'bg-green-100 text-green-800 border-green-400', tag: 'Green' };
//   if (score >= 0.5) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-400', tag: 'Yellow' };
//   return { color: 'bg-red-100 text-red-800 border-red-400', tag: 'Red' };
// };

// // const UPWORK_SERVICE_CATEGORIES = [
// //   "AI/ML",
// //   "QA",
// //   "Software Development",
// //   "Mobile App Development",
// //   "UI/UX",
// //   "DevOps",
// //   "Cloud DevOps",
// //   "VAPT",
// //   "Cybersecurity",
// //   "Data Engineering"
// // ];

// const UpworkJobDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const loading = useSelector(state => state.jobs.loading);



//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const jobFromRedux = useSelector(state =>
//     state.jobs.upworkJobsByDate
//       .flatMap(day => day.jobs || [])
//       .find(j => String(j._id) === String(id) || String(j.jobId) === String(id) || String(j.id) === String(id))
//   );

//   const currentUser = useSelector((state) => state.user.user);

//   // const dispatch = useDispatch();
//   // const job = location.state?.job;

//   // Local state for AE Remark, status, comments
//   const [aeRemarkInput, setAeRemarkInput] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [statusSaving, setStatusSaving] = useState(false);
//   const [savingAeRemark, setSavingAeRemark] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState("not_engaged");
//   const [commentUser, setCommentUser] = useState("");
//   const [comment, setComment] = useState("");
//   const [commentLoading, setCommentLoading] = useState(false);
//   const [localJob, setLocalJob] = useState(jobFromRedux || null);
//   const [loadingJob, setLoadingJob] = useState(false);
//   const [jobError, setJobError] = useState(null);
//   const [aeScoreInput, setAeScoreInput] = useState(localJob?.ae_score || "");
//   const [aeScoreUser, setAeScoreUser] = useState("");
//   const [aeScoreSaving, setAeScoreSaving] = useState(false);
//   const [aeScoreError, setAeScoreError] = useState("");
//   const [aePitchedInput, setAePitchedInput] = useState(localJob?.ae_pitched || "");
//   const [aePitchedSaving, setAePitchedSaving] = useState(false);
//   const [aePitchedError, setAePitchedError] = useState("");
//   const [estimatedBudgetInput, setEstimatedBudgetInput] = useState(localJob?.estimated_budget || "");
//   const [budgetSaving, setBudgetSaving] = useState(false);
//   const [budgetError, setBudgetError] = useState("");
//   const [user, setUser] = useState("");
//   const jobId = localJob?.jobId || localJob?.id;
//   const upworkProposalState = useSelector(state => {
//     const proposals = state.jobs.upworkProposals || {};
//     return proposals[jobId] || { text: '', locked: false };
//   });
//   const upworkProposalLoading = useSelector(state => state.jobs.upworkProposalLoading);
//   console.log("upworkProposalLoading", upworkProposalLoading);
//   const upworkProposalError = useSelector(state => state.jobs.upworkProposalError);
//   const upworkProposalSaving = useSelector(state => state.jobs.upworkProposalSaving);
//   const upworkProposalSaveError = useSelector(state => state.jobs.upworkProposalSaveError);

//   const [proposalCategory, setProposalCategory] = useState("");
//   const [showProposalUI, setShowProposalUI] = useState(true);
//   const [isEditingProposal, setIsEditingProposal] = useState(false);
//   const [editableProposal, setEditableProposal] = useState(upworkProposalState.text || "");



//   // const [proposalCategory, setProposalCategory] = useState("");
//   // const [editableProposal, setEditableProposal] = useState("");

//   // const upworkProposalLoading = useSelector(state => state.jobs.upworkProposalLoading);
//   // const upworkProposalError = useSelector(state => state.jobs.upworkProposalError);
//   // const upworkProposalSaving = useSelector(state => state.jobs.upworkProposalSaving);
//   // const upworkProposalSaveError = useSelector(state => state.jobs.upworkProposalSaveError);
//   // const jobId = localJob?.jobId || localJob?.id;
//   // const jobProposal = useSelector(state => (state.jobs.upworkProposals && jobId ? state.jobs.upworkProposals[jobId] : { text: '', locked: false }));

//   // useEffect(() => {
//   //   setEditableProposal(jobProposal.text || "");
//   // }, [jobProposal.text]);


//   useEffect(() => {
//     if (!jobFromRedux && id) {
//       setLoadingJob(true);
//       setJobError(null);
//       axios.get(`${REMOTE_HOST}/api/upwork/job?id=${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//       })
//         .then(res => {
//           //   if (!res.ok) throw new Error("Job not found");
//           //   return res.json();
//           // })
//           const data = res.data.job ? res.data.job : res.data;
//           setLocalJob(data);
//           setLoadingJob(false);
//         })
//         .catch(err => {
//           setJobError("Job not found.");
//           setLoadingJob(false);
//         });

//     } else if (jobFromRedux) {
//       setLocalJob(jobFromRedux);
//       setSaving(true);
//     }
//     console.log("local jobs", localJob);
//   }, [jobFromRedux, id]);
//   if (loadingJob) {
//     return <div className="p-8">Loading job details...</div>;
//   }
//   if (jobError) {
//     return <div className="p-8">{jobError}</div>;
//   }
//   if (!localJob) {
//     return null;
//   }

//   useEffect(() => {
//     setEditableProposal(upworkProposalState.text || "");
//     if (upworkProposalState.text) setShowProposalUI(false);
//   }, [upworkProposalState.text]);

//   useEffect(() => {
//     // Reset proposalLoading when job changes or component unmounts
//     return () => {
//       dispatch(setUpworkProposalLoading(false));
//     };
//   }, [id, dispatch]);

//   useEffect(() => {
//     if (upworkProposalState.text) {
//       setShowProposalUI(false);
//     }
//   }, [upworkProposalState.text]);

//   // if (loading) {
//   //   return <div className="p-8">Loading job details...</div>;
//   // }
//   // if (!job) {
//   //   return <div className="p-8">No job details found.</div>;
//   // }

//   //   // Sync local state with job object
//   //  useEffect(() => {
//   //   if (!job && id) {
//   //     dispatch(fetchJobByIdThunk(id));
//   //   }
//   // }, [job, id, dispatch]);

//   // if (loading) {
//   //   return <div className="p-8">Loading job details...</div>;
//   // }
//   // if (!job) {
//   //   return <div className="p-8">No job details found.</div>;
//   // }

//   const handleGenerateProposal = async (e) => {
//     e.preventDefault();
//     if (!proposalCategory) return;
//     await dispatch(generateUpworkProposalThunk({ jobId, selectedCategory: proposalCategory }));
//   };

//   const handleSaveProposal = async () => {
//     if (!editableProposal.trim()) return;
//     await dispatch(updateUpworkProposalThunk({ jobId, proposal: editableProposal.trim() }));
//     setIsEditingProposal(false);
//   };

//   const handleSaveAeRemark = async (e) => {
//     e.preventDefault();
//     setSavingAeRemark(true);
//     const jobId = localJob.jobId || localJob.id;
//     console.log('jobId', jobId);
//     try {
//       await dispatch(updateUpworkAeCommentThunk({ jobId, ae_comment: aeRemarkInput })).unwrap();
//       await dispatch(upworkfetchJobByIdThunk(jobId)).unwrap();
//       setAeRemarkInput("");
//     } catch (err) {
//       alert("Failed to save AE Remark.");
//     } finally {
//       setSavingAeRemark(false);
//     }
//   };
//   const handleSaveStatus = async (e) => {
//     e.preventDefault();
//     if (!selectedStatus) return;

//     setSaving(true);
//     // Use the _id field instead of jobId
//     const jobId = localJob._id;

//     if (!jobId) {
//       alert("Error: Job ID not found. Please refresh the page.");
//       setSaving(false);
//       return;
//     }

//     try {
//       console.log('Dispatching updateUpworkJobStatusNewThunk', { jobId, status: selectedStatus });
//       const result = await dispatch(updateUpworkJobStatusNewThunk({ jobId, status: selectedStatus })).unwrap();
//       console.log('Status updated successfully:', result);

//       // Update local job state with the response data
//       if (result.job) {
//         setLocalJob(prev => ({
//           ...prev,
//           currentStatus: result.job.currentStatus,
//           statusHistory: result.job.statusHistory,
//           comments: result.job.comments,
//           proposal: result.job.proposal
//         }));
//       } else {
//         setLocalJob(prev => ({
//           ...prev,
//           currentStatus: selectedStatus
//         }));
//       }

//       // Show success message
//       alert("Status updated successfully!");
//     } catch (err) {
//       console.error('Status update failed:', err);
//       alert("Failed to update status: " + err.message);
//     } finally {
//       setSaving(false);
//     }
//   };
//   const handleAddComment = async (e) => {
//     e.preventDefault();
//     if (!comment.trim()) return;
//     setCommentLoading(true);

//     const companyJobId = localJob?._id;
//     if (!companyJobId) {
//       alert("Error: Company Job ID not found.");
//       setCommentLoading(false);
//       return;
//     }

//     try {
//       const result = await dispatch(
//         addUpworkJobCommentThunk({ jobId: companyJobId, text: comment.trim() })
//       ).unwrap();

//       if (result?.job) {
//         setLocalJob(prev => ({
//           ...prev,
//           comments: result.job.comments,
//           currentStatus: result.job.currentStatus,
//           statusHistory: result.job.statusHistory
//         }));
//       }
//       setComment("");
//     } catch (err) {
//       alert("Failed to add comment.");
//     } finally {
//       setCommentLoading(false);
//     }
//   };

//   const handleSaveUpworkAeScore = async (e) => {
//     e.preventDefault();
//     setAeScoreSaving(true);
//     setAeScoreError("");
//     try {
//       const value = Number(aeScoreInput);
//       if (!aeScoreUser) {
//         setAeScoreError("Please select a user.");
//         setAeScoreSaving(false);
//         return;
//       }
//       if (isNaN(value) || value < 0 || value > 100) {
//         setAeScoreError("Please enter a valid score (0-100).");
//         setAeScoreSaving(false);
//         return;
//       }
//       await dispatch(updateUpworkAeScoreThunk({ jobId: localJob.jobId || localJob.id, username: aeScoreUser, ae_score: value })).unwrap();
//       await dispatch(upworkfetchJobByIdThunk(localJob.jobId || localJob.id)).unwrap();
//       setAeScoreInput(value);
//     } catch (err) {
//       setAeScoreError("Failed to save AE Score.");
//     } finally {
//       setAeScoreSaving(false);
//     }
//   };;
//   const handleSaveAePitched = async (e) => {
//     e.preventDefault();
//     setAePitchedSaving(true);
//     setAePitchedError("");
//     try {
//       if (!aePitchedInput.trim()) {
//         setAePitchedError("Please enter a value.");
//         setAePitchedSaving(false);
//         return;
//       }
//       await dispatch(updateUpworkAePitchedThunk({ jobId: localJob.jobId || localJob.id, ae_pitched: aePitchedInput.trim() })).unwrap();
//       setAePitchedInput(aePitchedInput.trim());
//     } catch (err) {
//       setAePitchedError("Failed to save AE Pitched.");
//     } finally {
//       setAePitchedSaving(false);
//     }
//   };

//   const handleSaveEstimatedBudget = async (e) => {
//     e.preventDefault();
//     setBudgetSaving(true);
//     setBudgetError("");
//     try {
//       const value = Number(estimatedBudgetInput);
//       if (isNaN(value) || value <= 0) {
//         setBudgetError("Please enter a valid number.");
//         setBudgetSaving(false);
//         return;
//       }
//       await dispatch(updateUpworkEstimatedBudgetThunk({ jobId: localJob.jobId || localJob.id, estimated_budget: value })).unwrap();
//       setEstimatedBudgetInput(value);
//     } catch (err) {
//       setBudgetError("Failed to save estimated budget.");
//     } finally {
//       setBudgetSaving(false);
//     }
//   };

//   if (!localJob) {
//     return <div className="p-8">No job details found.</div>;
//   }

//   const tierColorClass = badgeClass.tier[localJob.tier] || badgeClass.tier.Default;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
//         <button
//           className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
//           onClick={() => navigate(-1)}
//         >
//           &larr; Back to Jobs
//         </button>

//         {/* Job Overview Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">Job Overview</h2>
//           <div className="flex items-center gap-4 mb-2">
//             <h1 className="text-2xl font-bold text-gray-800 flex-1">{localJob.title}</h1>
//             {localJob.tier && (
//               <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass}`} title="Tier">
//                 {localJob.tier === 'Green' ? 'AI Recommended' :
//                   localJob.tier === 'Yellow' ? 'AI Not Recommended' :
//                     localJob.tier === 'Red' ? 'Not Eligible' : localJob.tier}
//               </span>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-2 mb-2">
//             {localJob.jobType && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-300">{localJob.jobType}</span>}
//             {localJob.occupation && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-indigo-100 text-indigo-800 border-indigo-300">{localJob.occupation}</span>}
//             {localJob.level && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">{localJob.level}</span>}
//             {localJob.contractorTier && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">{localJob.contractorTier}</span>}
//           </div>

//           <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
//             {/* <span className="font-bold">
//   Project Length:{" "}
//   {(() => {
//     const weeks = localJob.hourlyWeeks;
//     if (weeks === null || weeks === undefined || weeks < 4) return "Less than 1 month";
//     if (weeks >= 4 && weeks < 13) return "1 to 3 months";
//     if (weeks >= 13 && weeks < 25) return "3 to 6 months";
//     if (weeks >= 25) return "More than 6 months";
//     return "-";
//   })()}
// </span> */}

//             <span className="font-bold">Country: {localJob.country || '-'}</span>
//             <span className="font-bold">Industry: {localJob.companyIndustry || '-'}</span>
//             <span className="font-bold">Company Size: {localJob.companySize || '-'}</span>
//           </div>
//           <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
//             <span className="font-bold">Job Type: {localJob.jobType || '-'}</span>
//             <span className="font-bold">Hourly Type: {localJob.hourlyType || '-'}</span>
//             <span className="font-bold">Hourly Weeks: {localJob.hourlyWeeks || '-'}</span>
//             <span className="font-bold">Min Rate: {localJob.minHourlyRate ? `$${localJob.minHourlyRate}` : '-'}</span>
//             <span className="font-bold">Max Rate: {localJob.maxHourlyRate ? `$${localJob.maxHourlyRate}` : '-'}</span>
//           </div>
//           <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
//             <a href={localJob.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View on Upwork</a>
//           </div>
//         </section>
//         {/* Company Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">About the Company</h2>
//           <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
//             <span><span className="font-bold">Company:</span> {localJob.companyName || '-'}</span>
//             <span><span className="font-bold">Industry:</span> {localJob.companyIndustry || '-'}</span>
//             <span><span className="font-bold">Size:</span> {localJob.companySize || '-'}</span>
//           </div>
//         </section>
//         {/* Job Description Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">Job Description</h2>
//           <div className="prose prose-sm max-w-none whitespace-pre-line mb-2">{localJob.description}</div>
//         </section>
//         {/* Skills Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">Skills</h2>
//           <div className="flex flex-wrap gap-2">
//             {Array.isArray(localJob.skills) && localJob.skills.length > 0 ? (
//               localJob.skills.map((skill, idx) => (
//                 <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">{skill}</span>
//               ))
//             ) : (
//               <span className="text-xs text-gray-400">No skills listed.</span>
//             )}

//             <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
//               <span><span className="font-bold">Client History: buyerTotalJobsWithHires </span> {localJob.buyerTotalJobsWithHires === null || localJob.buyerTotalJobsWithHires === undefined
//                 ? "No hires"
//                 : localJob.buyerTotalJobsWithHires
//               }</span>
//             </div>
//           </div>
//         </section>
//         {/* KPIs Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">KPIs</h2>
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             {[
//               { label: 'Budget Attractiveness', value: localJob.kpi_budget_attractiveness },
//               { label: 'Avg Hourly Rate', value: localJob.kpi_avg_hourly_rate },
//               // { label: 'Contract to Hire', value: localJob.kpi_contract_to_hire },
//               // { label: 'Enterprise Heuristic', value: localJob.kpi_enterprise_heuristic },
//               { label: 'Hiring Rate', value: localJob.kpi_hiring_rate },
//               { label: 'Job Engagement', value: localJob.kpi_job_engagement },
//               { label: 'Job Title Relevance', value: localJob.kpi_job_title_relevance },
//               { label: 'Client Tenure', value: localJob.kpi_client_tenure },
//               { label: 'Client Hiring History', value: localJob.kpi_client_hiring_history },
//               { label: 'Client Active Assignments', value: localJob.kpi_client_active_assignments },
//               { label: 'Client Feedback Volume', value: localJob.kpi_client_feedback_volume },
//               { label: 'Client Open Jobs', value: localJob.kpi_client_open_jobs },
//               { label: 'Skill Match', value: localJob.kpi_skill_match },
//               { label: 'Weekly Hour Commitment', value: localJob.kpi_weekly_hour_commitment },
//               { label: 'Client Rating', value: localJob.kpi_client_rating },
//               { label: 'Client Activity Recency', value: localJob.kpi_client_activity_recency },
//               { label: 'Payment Verification', value: localJob.kpi_payment_verification },
//               { label: 'Job Level Match', value: localJob.kpi_job_level_match },
//             ].map(({ label, value }) => {
//               const { color } = getKpiBadge(value);
//               return (
//                 <div key={label} className="flex items-center gap-2">
//                   <span className="font-semibold w-32 inline-block">{label}:</span>
//                   <span className={`px-2 py-0.5 rounded text-xs font-bold border ${color} min-w-[36px] text-center`}>{value !== undefined && value !== '' ? value : '-'}</span>
//                 </div>
//               );
//             })}
//             {/* AI Score as percentage, no badge or color tag */}
//             <div className="flex items-center gap-2">
//               <span className="font-semibold w-32 inline-block">AI Score:</span>
//               <span className="text-xs font-bold min-w-[36px] text-center">{localJob.final_weighted_score !== undefined && localJob.final_weighted_score !== '' ? `${Math.round(parseFloat(localJob.final_weighted_score) * 100)}%` : '-'}</span>
//             </div>
//           </div>
//         </section>

//         {/* AE Score Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">AE Score</h2>
//           {Array.isArray(localJob.ae_score) && localJob.ae_score.length > 0 ? (
//             <div className="bg-green-50 border border-green-200 rounded p-3">
//               <span className="font-semibold">AE Score:</span> {localJob.ae_score[0].value}%
//             </div>
//           ) : (
//             <form onSubmit={handleSaveUpworkAeScore} className="flex flex-col gap-2 mb-2">
//               <select
//                 className="border rounded px-2 py-1"
//                 value={aeScoreUser}
//                 onChange={e => setAeScoreUser(e.target.value)}
//                 required
//               >
//                 <option value="">Select User</option>
//                 {USER_LIST.map(user => (
//                   <option key={user} value={user}>{user}</option>
//                 ))}
//               </select>
//               <input
//                 type="number"
//                 className="border rounded px-2 py-1 w-full"
//                 placeholder="Enter AE Score (0-100)"
//                 value={aeScoreInput}
//                 onChange={e => setAeScoreInput(e.target.value)}
//                 disabled={aeScoreSaving}
//                 min={0}
//                 max={100}
//                 required
//               />
//               <button
//                 type="submit"
//                 className="self-start px-4 py-1 bg-blue-600 text-white rounded"
//                 disabled={aeScoreSaving || !aeScoreUser || !aeScoreInput}
//               >
//                 {aeScoreSaving ? "Saving..." : "Save"}
//               </button>
//               {aeScoreError && <div className="text-red-500 text-sm">{aeScoreError}</div>}
//             </form>
//           )}
//         </section>
//         {/* AE Pitched Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">AE Pitched</h2>
//           {localJob.ae_pitched ? (
//             <div className="bg-green-50 border border-green-200 rounded p-3 text-green-900">
//               <span className="font-semibold">AE Pitched:</span> {localJob.ae_pitched}
//             </div>
//           ) : (
//             <form onSubmit={handleSaveAePitched} className="flex flex-col gap-2 mb-2">
//               <textarea
//                 className="border rounded px-2 py-1 w-full"
//                 rows={2}
//                 placeholder="Write AE Pitched..."
//                 value={aePitchedInput}
//                 onChange={e => setAePitchedInput(e.target.value)}
//                 disabled={aePitchedSaving}
//                 required
//               />
//               <button
//                 type="submit"
//                 className="self-start px-4 py-1 bg-blue-600 text-white rounded"
//                 disabled={aePitchedSaving || !aePitchedInput.trim()}
//               >
//                 {aePitchedSaving ? "Saving..." : "Save"}
//               </button>
//               {aePitchedError && <div className="text-red-500 text-sm">{aePitchedError}</div>}
//             </form>
//           )}
//         </section>

//         {/* Estimated Budget Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">Estimated Budget</h2>
//           {localJob.estimated_budget ? (
//             <div className="bg-green-50 border border-green-200 rounded p-3 text-green-900">
//               <span className="font-semibold">Estimated Budget:</span> ${localJob.estimated_budget}
//             </div>
//           ) : (
//             <form onSubmit={handleSaveEstimatedBudget} className="flex flex-col gap-2 mb-2">
//               <input
//                 type="number"
//                 className="border rounded px-2 py-1 w-full"
//                 placeholder="Enter estimated budget"
//                 value={estimatedBudgetInput}
//                 onChange={e => setEstimatedBudgetInput(e.target.value)}
//                 disabled={budgetSaving}
//                 min={1}
//                 required
//               />
//               <button
//                 type="submit"
//                 className="self-start px-4 py-1 bg-blue-600 text-white rounded"
//                 disabled={budgetSaving || !estimatedBudgetInput}
//               >
//                 {budgetSaving ? "Saving..." : "Save"}
//               </button>
//               {budgetError && <div className="text-red-500 text-sm">{budgetError}</div>}
//             </form>
//           )}
//         </section>
//         {/* AI Remark Section */}
//         {localJob.ai_remark && (
//           <section className="mb-6 border-b pb-4">
//             <h2 className="text-lg font-bold mb-3 text-gray-800">AI Remark</h2>
//             <div className="prose prose-sm max-w-none whitespace-pre-line mb-2 text-blue-900 bg-blue-50 p-3 rounded border border-blue-200">
//               {localJob.ai_remark}
//             </div>
//           </section>
//         )}
//         {/* AE Remark Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">AE Remark</h2>
//           {!localJob.ae_comment ? (
//             <form onSubmit={handleSaveAeRemark} className="flex flex-col gap-2 mb-2">
//               <textarea
//                 className="border rounded px-2 py-1 w-full"
//                 rows={4}
//                 placeholder="Write AE Remark..."
//                 value={aeRemarkInput}
//                 onChange={e => setAeRemarkInput(e.target.value)}
//                 disabled={savingAeRemark}
//               />
//               <button
//                 type="submit"
//                 className="self-start px-4 py-1 bg-blue-600 text-white rounded"
//                 disabled={savingAeRemark || !aeRemarkInput.trim()}
//               >
//                 {savingAeRemark ? "Saving..." : "Save"}
//               </button>
//             </form>
//           ) : (
//             <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-900">
//               <span className="font-semibold">Saved AE Remark:</span>
//               <div>{localJob.ae_comment}</div>
//             </div>
//           )}
//         </section>
//         {/* Comments Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">Add Comments</h2>
//           <form onSubmit={handleAddComment} className="mb-4 flex flex-col md:flex-row gap-2 items-center">
//             <input
//               type="text"
//               value={comment}
//               onChange={e => setComment(e.target.value)}
//               placeholder="Add a comment..."
//               className="border px-2 py-1 rounded w-full"
//               disabled={commentLoading}
//               required
//             />
//             <button
//               type="submit"
//               className="px-4 py-1 bg-blue-600 text-white rounded"
//               disabled={commentLoading || !comment.trim()}
//             >
//               {commentLoading ? "Saving..." : "Add"}
//             </button>
//           </form>
//           <ul className="mb-4">
//             {Array.isArray(localJob.comments) && localJob.comments.length > 0 ? (
//               localJob.comments.map((c, idx) => (
//                 <li key={idx} className="text-sm text-gray-700 mb-1">
//                   {c.username && <span className="font-semibold">{c.username}:</span>} {c.text || c.comment || ""}
//                   {c.date && (
//                     <span className="text-xs text-gray-500 ml-2">
//                       ({new Date(c.date).toLocaleString()})
//                     </span>
//                   )}
//                 </li>
//               ))
//             ) : (
//               <li className="text-sm text-gray-400">No comments yet.</li>
//             )}
//           </ul>
//         </section>
//         {/* Status Management Section */}
//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">Update Status</h2>
//           <form onSubmit={handleSaveStatus} className="flex flex-col gap-2 mb-2 md:flex-row md:items-center">
//             <select
//               className="border rounded px-2 py-1"
//               value={selectedStatus}
//               onChange={e => setSelectedStatus(e.target.value)}
//             >
//               {STATUS_OPTIONS.map(status => (
//                 <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
//               ))}
//             </select>
//             <button
//               type="submit"
//               className="px-4 py-1 bg-blue-600 text-white rounded"
//               disabled={statusSaving}
//             >
//               {statusSaving ? "Updating..." : "Update Status"}

//             </button>
//           </form>

//           {/* Show current status */}
//           <div className="mb-2">
//             <span className="font-semibold">Current Status:</span>{" "}
//             <span className="px-2 py-1 rounded bg-gray-100">
//               {(localJob.currentStatus || "-").replace(/_/g, " ")}
//             </span>
//           </div>

//           {/* Show who updated the status */}
//           <div className="text-sm text-gray-500">
//             Status updated by: {currentUser?.username || 'Current User'}
//           </div>

//           {/* Show status history if available */}
//           {localJob.statusHistory && localJob.statusHistory.length > 0 && (
//             <div className="mt-3">
//               <span className="font-semibold text-sm">Status History:</span>
//               <ul className="mt-1 space-y-1">
//                 {localJob.statusHistory.map((entry, idx) => (
//                   <li key={idx} className="text-xs text-gray-600">
//                     <span className="font-medium">{entry.username}</span> set status to{" "}
//                     <span className="px-1 py-0.5 rounded bg-gray-200 text-xs">
//                       {entry.status.replace(/_/g, " ")}
//                     </span>{" "}
//                     <span className="text-gray-500">
//                       ({entry.date ? new Date(entry.date).toLocaleString() : "-"})
//                     </span>
//                     {entry.notes && <span className="text-gray-500 ml-2">- {entry.notes}</span>}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </section>

//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">Generate Proposal</h2>
//           {showProposalUI ? (
//             <form onSubmit={handleGenerateProposal} className="flex flex-col gap-2 mb-2">
//               <select
//                 className="border rounded px-2 py-1"
//                 value={proposalCategory}
//                 onChange={e => setProposalCategory(e.target.value)}
//                 required
//               >
//                 <option value="">Select Service Category</option>
//                 {UPWORK_SERVICE_CATEGORIES.map(cat => (
//                   <option key={cat} value={cat}>{cat}</option>
//                 ))}
//               </select>
//               <button
//                 type="submit"
//                 className="self-start px-4 py-1 bg-blue-600 text-white rounded"
//                 disabled={upworkProposalLoading || !proposalCategory}
//               >
//                 {upworkProposalLoading ? "Generating..." : "Generate Proposal"}
//               </button>
//               {upworkProposalError && <div className="text-red-500 text-sm">{upworkProposalError}</div>}
//             </form>
//           ) : (
//             <div>
//               <label className="block font-semibold mb-1">Generated Proposal:</label>
//               <textarea
//                 className="border rounded px-2 py-1 w-full"
//                 rows={8}
//                 value={isEditingProposal ? editableProposal : upworkProposalState.text}
//                 onChange={e => setEditableProposal(e.target.value)}
//                 readOnly={!isEditingProposal}
//               />
//               <div className="flex gap-2 mt-2">
//                 {!isEditingProposal && !upworkProposalState.locked && (
//                   <button
//                     className="px-4 py-1 bg-yellow-500 text-white rounded"
//                     onClick={() => setIsEditingProposal(true)}
//                   >
//                     Edit
//                   </button>
//                 )}
//                 {isEditingProposal && (
//                   <>
//                     <button
//                       className="px-4 py-1 bg-blue-600 text-white rounded"
//                       onClick={handleSaveProposal}
//                       disabled={upworkProposalSaving}
//                     >
//                       {upworkProposalSaving ? "Saving..." : "Save"}
//                     </button>
//                     <button
//                       className="px-4 py-1 bg-gray-400 text-white rounded"
//                       onClick={() => {
//                         setEditableProposal(upworkProposalState.text || "");
//                         setIsEditingProposal(false);
//                       }}
//                       disabled={upworkProposalSaving}
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 )}
//               </div>
//               {upworkProposalSaveError && <div className="text-red-500 text-sm">{upworkProposalSaveError}</div>}
//             </div>
//           )}
//         </section>

//         {/* Raw JSON for debugging
//         <details className="mt-4">
//           <summary className="cursor-pointer text-xs text-gray-400">Raw Job Data</summary>
//             <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(localJob, null, 2)}</pre>
//         </details> */}
//       </div>
//     </div>
//   );
// };

// export default UpworkJobDetails;


//updated ui 
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUpworkJobsByDateThunk, updateUpworkAeCommentThunk, addUpworkJobCommentThunk, upworkfetchJobByIdThunk, updateUpworkAeScoreThunk,
  updateUpworkAePitchedThunk, updateUpworkEstimatedBudgetThunk, generateUpworkProposalThunk, updateUpworkProposalThunk, setUpworkProposalLoading, updateJobStatusNewThunk, updateUpworkJobStatusNewThunk
} from "../slices/jobsSlice";
import axios from "axios";

const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const PORT = import.meta.env.VITE_PORT;

const STATUS_OPTIONS = [
  'not_engaged', 'applied', 'engaged', 'interview', 'offer', 'rejected', 'onboard'
];

const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];

const UPWORK_SERVICE_CATEGORIES = [
  "AI/ML", "QA", "Software Development", "Mobile App Development", "UI/UX",
  "DevOps", "Cloud DevOps", "VAPT", "Cybersecurity", "Data Engineering"
];

const badgeClass = {
  tier: {
    Yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400',
    Green: 'bg-green-200 text-green-800 border-green-400',
    Red: 'bg-red-200 text-red-800 border-red-400',
    Default: 'bg-gray-200 text-gray-700 border-gray-300',
  },
  jobType: 'bg-blue-100 text-blue-800 border-blue-300',
  occupation: 'bg-indigo-100 text-indigo-800 border-indigo-300',
};

const getKpiBadge = (score) => {
  if (typeof score !== 'number') score = parseFloat(score);
  if (isNaN(score)) return { color: 'bg-gray-200 text-gray-700 border-gray-300', tag: '' };
  if (score >= 0.7) return { color: 'bg-green-100 text-green-800 border-green-400', tag: 'Green' };
  if (score >= 0.5) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-400', tag: 'Yellow' };
  return { color: 'bg-red-100 text-red-800 border-red-400', tag: 'Red' };
};

const UpworkJobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loading = useSelector(state => state.jobs.loading);
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.user);

  const jobFromRedux = useSelector(state =>
    state.jobs.upworkJobsByDate
      .flatMap(day => day.jobs || [])
      .find(j => String(j._id) === String(id) || String(j.jobId) === String(id) || String(j.id) === String(id))
  );

  // Local state for form inputs
  const [formData, setFormData] = useState({
    status: 'not_engaged',
    ae_comment: '',
    ae_score: '',
    ae_score_user: '',
    ae_pitched: '',
    estimated_budget: '',
    comment: '',
    proposal_category: '',
    proposal_text: ''
  });

  // UI state
  const [localJob, setLocalJob] = useState(jobFromRedux || null);
  const [loadingJob, setLoadingJob] = useState(false);
  const [jobError, setJobError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showProposalUI, setShowProposalUI] = useState(true);
  const [isEditingProposal, setIsEditingProposal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // Proposal state
  const jobId = localJob?.jobId || localJob?.id;
  const upworkProposalState = useSelector(state => {
    const proposals = state.jobs.upworkProposals || {};
    return proposals[jobId] || { text: '', locked: false };
  });
  const upworkProposalLoading = useSelector(state => state.jobs.upworkProposalLoading);
  const upworkProposalError = useSelector(state => state.jobs.upworkProposalError);
  const upworkProposalSaving = useSelector(state => state.jobs.upworkProposalSaving);
  const upworkProposalSaveError = useSelector(state => state.jobs.upworkProposalSaveError);
  const jobIdForCompanyAPIs = localJob?._id || jobId;

  // Initialize form data when job loads
  useEffect(() => {
    if (localJob) {
      setFormData({
        status: localJob.currentStatus || 'not_engaged',
        ae_comment: localJob.ae_comment || '',
        ae_score: localJob.ae_score?.[0]?.value || '',
        ae_score_user: localJob.ae_score?.[0]?.username || '',
        ae_pitched: localJob.ae_pitched || '',
        estimated_budget: localJob.estimated_budget || '',
        comment: '',
        proposal_category: '',
        proposal_text: upworkProposalState.text || ''
      });
      setHasUnsavedChanges(false);
    }
  }, [localJob, upworkProposalState.text]);

  // Load job if not in Redux
  useEffect(() => {
    if (!jobFromRedux && id) {
      setLoadingJob(true);
      setJobError(null);
      axios.get(`${REMOTE_HOST}/api/upwork/job?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
        .then(res => {
          const data = res.data.job ? res.data.job : res.data;
          setLocalJob(data);
          setLoadingJob(false);
        })
        .catch(err => {
          setJobError("Job not found.");
          setLoadingJob(false);
        });
    } else if (jobFromRedux) {
      setLocalJob(jobFromRedux);
    }
  }, [jobFromRedux, id]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  // Check for unsaved changes before navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle navigation with unsaved changes
  const handleNavigation = (targetPath) => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      navigate(targetPath);
    }
  };

  // Save all changes
  const handleSaveAll = async () => {
    if (!hasUnsavedChanges) return;

    setSaving(true);
    const errors = [];
    const updates = [];
    let updatedJobData = { ...localJob };

    try {
      // Update status if changed
      if (formData.status !== (localJob?.currentStatus || 'not_engaged')) {
        try {
          const result = await dispatch(updateUpworkJobStatusNewThunk({
            jobId: localJob._id,
            status: formData.status
          })).unwrap();

          if (result.job) {
            updatedJobData = {
              ...updatedJobData,
              currentStatus: result.job.currentStatus,
              statusHistory: result.job.statusHistory
            };
          }
          updates.push('Status');
        } catch (err) {
          errors.push(`Status: ${err.message}`);
        }
      }

      // Update AE Comment if changed
      if (formData.ae_comment !== (localJob?.ae_comment || '')) {
        try {
          await dispatch(updateUpworkAeCommentThunk({
            jobId: localJob.jobId || localJob.id,
            ae_comment: formData.ae_comment
          })).unwrap();
          updatedJobData.ae_comment = formData.ae_comment;
          updates.push('AE Comment');
        } catch (err) {
          errors.push(`AE Comment: ${err.message}`);
        }
      }

      // Update AE Score if changed
      if (formData.ae_score !== (localJob?.ae_score?.[0]?.value || '') && formData.ae_score_user) {
        try {
          await dispatch(updateUpworkAeScoreThunk({
            jobId: localJob.jobId || localJob.id,
            username: formData.ae_score_user,
            ae_score: Number(formData.ae_score)
          })).unwrap();
          updatedJobData.ae_score = [{ value: Number(formData.ae_score), username: formData.ae_score_user }];
          updates.push('AE Score');
        } catch (err) {
          errors.push(`AE Score: ${err.message}`);
        }
      }

      // Update AE Pitched if changed
      if (formData.ae_pitched !== (localJob?.ae_pitched || '')) {
        try {
          await dispatch(updateUpworkAePitchedThunk({
            jobId: localJob.jobId || localJob.id,
            ae_pitched: formData.ae_pitched
          })).unwrap();
          updatedJobData.ae_pitched = formData.ae_pitched;
          updates.push('AE Pitched');
        } catch (err) {
          errors.push(`AE Pitched: ${err.message}`);
        }
      }

      // Update Estimated Budget if changed
      if (formData.estimated_budget !== (localJob?.estimated_budget || '')) {
        try {
          await dispatch(updateUpworkEstimatedBudgetThunk({
            jobId: localJob.jobId || localJob.id,
            estimated_budget: Number(formData.estimated_budget)
          })).unwrap();
          updatedJobData.estimated_budget = Number(formData.estimated_budget);
          updates.push('Estimated Budget');
        } catch (err) {
          errors.push(`Estimated Budget: ${err.message}`);
        }
      }

      // Add comment if provided
      if (formData.comment.trim()) {
        try {
          const result = await dispatch(addUpworkJobCommentThunk({
            jobId: localJob._id,
            text: formData.comment.trim()
          })).unwrap();

          if (result?.job) {
            updatedJobData = {
              ...updatedJobData,
              comments: result.job.comments,
              currentStatus: result.job.currentStatus,
              statusHistory: result.job.statusHistory
            };
          }
          updates.push('Comment');
          setFormData(prev => ({ ...prev, comment: '' }));
        } catch (err) {
          errors.push(`Comment: ${err.message}`);
        }
      }

      // Update proposal if changed
      if (formData.proposal_text !== (upworkProposalState.text || '') && formData.proposal_text.trim()) {
        try {
          await dispatch(updateUpworkProposalThunk({
            jobId,
            proposal: formData.proposal_text.trim()
          })).unwrap();
          updates.push('Proposal');
          setIsEditingProposal(false);
        } catch (err) {
          errors.push(`Proposal: ${err.message}`);
        }
      }

      // FIXED: Update local state with all the changes
      if (updates.length > 0) {
        setLocalJob(updatedJobData);

        // Also update the Redux store to keep everything in sync
        // This ensures the dashboard shows the updated data
        dispatch({
          type: 'jobs/updateLocalJob',
          payload: { jobId: localJob._id, updatedJob: updatedJobData }
        });
      }

      // Show results
      if (errors.length > 0) {
        alert(`Some updates failed:\n${errors.join('\n')}`);
      } else if (updates.length > 0) {
        alert(`Successfully updated: ${updates.join(', ')}`);
        setHasUnsavedChanges(false);
      }

    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Generate proposal
  const handleGenerateProposal = async () => {
    if (!formData.proposal_category) return;

    try {
      const result = await dispatch(
        generateUpworkProposalThunk({
          jobId: jobIdForCompanyAPIs,
          selectedCategory: formData.proposal_category,
        })
      ).unwrap();

      setFormData(prev => ({
        ...prev,
        proposal_text: result?.proposal || '',
        proposal_category: '',
      }));
      setShowProposalUI(false);
      setHasUnsavedChanges(true);
    } catch (err) {
      alert(`Failed to generate proposal: ${err.message}`);
    }
  };
  const handleSaveProposal = async () => {
    const text = (formData.proposal_text || '').trim();
    if (!text) return;

    try {
      await dispatch(updateUpworkProposalThunk({
        jobId: jobIdForCompanyAPIs,
        proposal: text,
      })).unwrap();
      setHasUnsavedChanges(false);
      alert('Proposal saved.');
    } catch (err) {
      alert(`Failed to save proposal: ${err.message}`);
    }
  };



  // const handleGenerateProposal = async () => {
  //   if (!formData.proposal_category) return;

  //   try {
  //     await dispatch(generateUpworkProposalThunk({ 
  //       jobId, 
  //       selectedCategory: formData.proposal_category 
  //     })).unwrap();

  //     setFormData(prev => ({ 
  //       ...prev, 
  //       proposal_text: upworkProposalState.text || '',
  //       proposal_category: '' 
  //     }));
  //     setShowProposalUI(false);
  //     setHasUnsavedChanges(true);
  //   } catch (err) {
  //     alert(`Failed to generate proposal: ${err.message}`);
  //   }
  // };

  // Loading and error states
  if (loadingJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (jobError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">{jobError}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!localJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No job details found.</p>
        </div>
      </div>
    );
  }

  const tierColorClass = badgeClass.tier[localJob.tier] || badgeClass.tier.Default;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Unsaved Changes Warning Modal */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Unsaved Changes</h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to leave without saving?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnsavedWarning(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnsavedWarning(false);
                  setHasUnsavedChanges(false);
                  navigate(-1);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Leave Without Saving
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header with Save Button */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              onClick={() => handleNavigation(-1)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Jobs
            </button>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <span className="text-orange-600 text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Unsaved Changes
                </span>
              )}

              <button
                onClick={handleSaveAll}
                disabled={!hasUnsavedChanges || saving}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${hasUnsavedChanges
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </span>
                ) : (
                  'Save All Changes'
                )}
              </button>
            </div>
          </div>

          {/* Job Title and Badges */}
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex-1">{localJob.title}</h1>
            {localJob.tier && (
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${tierColorClass}`}>
                {localJob.tier === 'Green' ? 'AI Recommended' :
                  localJob.tier === 'Yellow' ? 'AI Not Recommended' :
                    localJob.tier === 'Red' ? 'Not Eligible' : localJob.tier}
              </span>
            )}
          </div>

          {/* Job Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h4z" />
              </svg>
              {localJob.jobType || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {localJob.country || 'N/A'}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {localJob.minHourlyRate ? `$${localJob.minHourlyRate}` : 'N/A'}
            </span>
            <a
              href={localJob.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Upwork
            </a>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
                {localJob.description}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(localJob.skills) && localJob.skills.length > 0 ? (
                  localJob.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No skills listed</span>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Client History:</span> {localJob.buyerTotalJobsWithHires || "No hires"}
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Key Performance Indicators</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Budget Attractiveness', value: localJob.kpi_budget_attractiveness },
                  { label: 'Avg Hourly Rate', value: localJob.kpi_avg_hourly_rate },
                  { label: 'Hiring Rate', value: localJob.kpi_hiring_rate },
                  { label: 'Job Engagement', value: localJob.kpi_job_engagement },
                  { label: 'Job Title Relevance', value: localJob.kpi_job_title_relevance },
                  { label: 'Client Tenure', value: localJob.kpi_client_tenure },
                  { label: 'Client Hiring History', value: localJob.kpi_client_hiring_history },
                  { label: 'Client Active Assignments', value: localJob.kpi_client_active_assignments },
                  { label: 'Client Feedback Volume', value: localJob.kpi_client_feedback_volume },
                  { label: 'Client Open Jobs', value: localJob.kpi_client_open_jobs },
                  { label: 'Skill Match', value: localJob.kpi_skill_match },
                  { label: 'Weekly Hour Commitment', value: localJob.kpi_weekly_hour_commitment },
                  { label: 'Client Rating', value: localJob.kpi_client_rating },
                  { label: 'Client Activity Recency', value: localJob.kpi_client_activity_recency },
                  { label: 'Payment Verification', value: localJob.kpi_payment_verification },
                  { label: 'Job Level Match', value: localJob.kpi_job_level_match },
                ].map(({ label, value }) => {
                  const { color } = getKpiBadge(value);
                  return (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{label}:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${color}`}>
                        {value !== undefined && value !== '' ? value : '-'}
                      </span>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between col-span-2">
                  <span className="text-sm font-medium text-gray-700">AI Score:</span>
                  <span className="text-sm font-bold text-blue-600">
                    {localJob.final_weighted_score !== undefined && localJob.final_weighted_score !== ''
                      ? `${Math.round(parseFloat(localJob.final_weighted_score) * 100)}%`
                      : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Remark */}
            {localJob.ai_remark && (
              <section className="mb-6 border-b pb-4">
                <h2 className="text-lg font-bold mb-3 text-gray-800">AI Remark</h2>
                <div className="prose prose-sm max-w-none whitespace-pre-line mb-2 text-blue-900 bg-blue-50 p-3 rounded border border-blue-200">
                  {localJob.ai_remark}
                </div>

                {/* Proposal (left side, under AI Remark) */}
                <div className="mt-6">
                  <h3 className="text-base font-semibold mb-2 text-gray-800">Proposal</h3>

                  {(!formData.proposal_text || showProposalUI) ? (
                    <div className="space-y-3">
                      <select
                        value={formData.proposal_category}
                        onChange={(e) => handleInputChange('proposal_category', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Service Category</option>
                        {UPWORK_SERVICE_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      <button
                        onClick={handleGenerateProposal}
                        disabled={!formData.proposal_category || upworkProposalLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {upworkProposalLoading ? "Generating..." : "Generate Proposal"}
                      </button>

                      {upworkProposalError && (
                        <div className="text-red-500 text-sm">{upworkProposalError}</div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Generated Proposal</label>
                      <textarea
                        className="w-full border rounded p-2 min-h-[160px]"
                        value={formData.proposal_text}
                        onChange={e => {
                          setFormData(prev => ({ ...prev, proposal_text: e.target.value }));
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="Your generated proposal will appear here..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProposal}
                          className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Save Proposal
                        </button>
                        <button
                          onClick={() => {
                            setFormData(prev => ({ ...prev, proposal_text: upworkProposalState.text || '' }));
                            setHasUnsavedChanges(false);
                          }}
                          className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Reset
                        </button>
                      </div>
                      {upworkProposalSaveError && (
                        <div className="text-red-500 text-sm">{upworkProposalSaveError}</div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Editable Fields */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Status Management</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">Updated by:</span> {currentUser?.username || 'Current User'}
              </div>

              {/* Status History */}
              {localJob.statusHistory && localJob.statusHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status History</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {localJob.statusHistory.map((entry, idx) => (
                      <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <div className="font-medium">{entry.username}</div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                            {entry.status.replace(/_/g, " ")}
                          </span>
                          <span className="text-gray-500">
                            {entry.date ? new Date(entry.date).toLocaleDateString() : "-"}
                          </span>
                        </div>
                        {entry.notes && <div className="text-gray-500 mt-1">{entry.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AE Score */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">AE Score</h2>

              {Array.isArray(localJob.ae_score) && localJob.ae_score.length > 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-900">
                    <span className="font-semibold">Score:</span> {localJob.ae_score[0].value}%
                  </div>
                  <div className="text-green-700 text-sm">
                    <span className="font-medium">By:</span> {localJob.ae_score[0].username}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <select
                      value={formData.ae_score_user}
                      onChange={(e) => handleInputChange('ae_score_user', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select User</option>
                      {USER_LIST.map(user => (
                        <option key={user} value={user}>{user}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Score (0-100)</label>
                    <input
                      type="number"
                      value={formData.ae_score}
                      onChange={(e) => handleInputChange('ae_score', e.target.value)}
                      min="0"
                      max="100"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter score"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* AE Comment */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">AE Remark</h2>

              {localJob.ae_comment ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-900">{localJob.ae_comment}</div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Remark</label>
                  <textarea
                    value={formData.ae_comment}
                    onChange={(e) => handleInputChange('ae_comment', e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write AE remark..."
                  />
                </div>
              )}
            </div>

            {/* AE Pitched */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">AE Pitched</h2>

              {localJob.ae_pitched ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-900">{localJob.ae_pitched}</div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Pitch</label>
                  <textarea
                    value={formData.ae_pitched}
                    onChange={(e) => handleInputChange('ae_pitched', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write AE pitch..."
                  />
                </div>
              )}
            </div>

            {/* Estimated Budget */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Estimated Budget</h2>

              {localJob.estimated_budget ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-900">
                    <span className="font-semibold">Budget:</span> ${localJob.estimated_budget}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Set Budget</label>
                  <input
                    type="number"
                    value={formData.estimated_budget}
                    onChange={(e) => handleInputChange('estimated_budget', e.target.value)}
                    min="1"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter budget amount"
                  />
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Comment</h2>

              <div className="space-y-3">
                <textarea
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a comment..."
                />

                {Array.isArray(localJob.comments) && localJob.comments.length > 0 && (
                  <div className="border-t pt-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Comments</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {localJob.comments.slice(-3).map((c, idx) => (
                        <div key={idx} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          <div className="font-medium">{c.username || 'Unknown'}</div>
                          <div className="text-gray-700">{c.text || c.comment || ""}</div>
                          {c.date && (
                            <div className="text-gray-500 text-xs mt-1">
                              {new Date(c.date).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Proposal Generation
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Proposal</h2>

              {showProposalUI ? (
                <div className="space-y-3">
                  <select
                    value={formData.proposal_category}
                    onChange={(e) => handleInputChange('proposal_category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Service Category</option>
                    {UPWORK_SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <button
                    onClick={handleGenerateProposal}
                    disabled={!formData.proposal_category || upworkProposalLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {upworkProposalLoading ? "Generating..." : "Generate Proposal"}
                  </button>

                  {upworkProposalError && (
                    <div className="text-red-500 text-sm">{upworkProposalError}</div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Generated Proposal</label>
                    <textarea
                      value={isEditingProposal ? formData.proposal_text : upworkProposalState.text}
                      onChange={(e) => {
                        handleInputChange('proposal_text', e.target.value);
                        setIsEditingProposal(true);
                      }}
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly={!isEditingProposal}
                    />
                  </div>

                  {!upworkProposalState.locked && (
                    <div className="flex gap-2">
                      {!isEditingProposal ? (
                        <button
                          onClick={() => setIsEditingProposal(true)}
                          className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsEditingProposal(false);
                              setFormData(prev => ({ ...prev, proposal_text: upworkProposalState.text || '' }));
                            }}
                            className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {upworkProposalSaveError && (
                    <div className="text-red-500 text-sm">{upworkProposalSaveError}</div>
                  )}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpworkJobDetails;