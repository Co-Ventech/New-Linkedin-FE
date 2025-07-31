import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux";

import { fetchUpworkJobsByDateThunk, updateUpworkJobStatusThunk , updateUpworkAeCommentThunk, addUpworkJobCommentThunk, upworkfetchJobByIdThunk, updateUpworkAeScoreThunk, 
  updateUpworkAePitchedThunk , updateUpworkEstimatedBudgetThunk , generateUpworkProposalThunk , updateUpworkProposalThunk, setUpworkProposalLoading } from "../slices/jobsSlice";
import axios from "axios";


// import { updateUpworkAeCommentThunk, updateUpworkJobStatusThunk, addUpworkJobCommentThunk } from "../slices/jobsSlice";
// await dispatch(updateUpworkJobStatusThunk({ jobId: job.id, status: ..., username:  }))
// const dispatch = useDispatch();

const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const PORT = import.meta.env.VITE_PORT;

const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];
const STATUS_OPTIONS = [
  'not_engaged', 'applied', 'engaged', 'interview', 'offer', 'rejected', 'archived'
];
const UPWORK_SERVICE_CATEGORIES = [
  "AI/ML",
  "QA",
  "Software Development",
  "Mobile App Development",
  "UI/UX",
  "DevOps",
  "Cloud DevOps",
  "VAPT",
  "Cybersecurity",
  "Data Engineering"
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

const UpworkJobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loading = useSelector(state => state.jobs.loading);


  
const { id } = useParams();
const dispatch = useDispatch();
const jobFromRedux = useSelector(state =>
  state.jobs.upworkJobsByDate
    .flatMap(day => day.jobs || [])
    .find(j => String(j.jobId) === String(id) || String(j.id) === String(id))
);
  // const dispatch = useDispatch();
  // const job = location.state?.job;

  // Local state for AE Remark, status, comments
  const [aeRemarkInput, setAeRemarkInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingAeRemark, setSavingAeRemark] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("not_engaged");
  const [commentUser, setCommentUser] = useState("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [localJob, setLocalJob] = useState(jobFromRedux || null);
  const [loadingJob, setLoadingJob] = useState(false);
  const [jobError, setJobError] = useState(null);
  const [aeScoreInput, setAeScoreInput] = useState(localJob?.ae_score || "");
  const [aeScoreUser, setAeScoreUser] = useState("");
  const [aeScoreSaving, setAeScoreSaving] = useState(false);
  const [aeScoreError, setAeScoreError] = useState("");
  const [aePitchedInput, setAePitchedInput] = useState(localJob?.ae_pitched || "");
const [aePitchedSaving, setAePitchedSaving] = useState(false);
const [aePitchedError, setAePitchedError] = useState("");
const [estimatedBudgetInput, setEstimatedBudgetInput] = useState(localJob?.estimated_budget || "");
const [budgetSaving, setBudgetSaving] = useState(false);
const [budgetError, setBudgetError] = useState("");
const jobId = localJob?.jobId || localJob?.id;
const upworkProposalState = useSelector(state => {
  const proposals = state.jobs.upworkProposals || {};
  return proposals[jobId] || { text: '', locked: false };
});
const upworkProposalLoading = useSelector(state => state.jobs.upworkProposalLoading);
console.log("upworkProposalLoading", upworkProposalLoading);
const upworkProposalError = useSelector(state => state.jobs.upworkProposalError);
const upworkProposalSaving = useSelector(state => state.jobs.upworkProposalSaving);
const upworkProposalSaveError = useSelector(state => state.jobs.upworkProposalSaveError);

const [proposalCategory, setProposalCategory] = useState("");
const [showProposalUI, setShowProposalUI] = useState(true);
const [isEditingProposal, setIsEditingProposal] = useState(false);
const [editableProposal, setEditableProposal] = useState(upworkProposalState.text || "");

// const [proposalCategory, setProposalCategory] = useState("");
// const [editableProposal, setEditableProposal] = useState("");

// const upworkProposalLoading = useSelector(state => state.jobs.upworkProposalLoading);
// const upworkProposalError = useSelector(state => state.jobs.upworkProposalError);
// const upworkProposalSaving = useSelector(state => state.jobs.upworkProposalSaving);
// const upworkProposalSaveError = useSelector(state => state.jobs.upworkProposalSaveError);
// const jobId = localJob?.jobId || localJob?.id;
// const jobProposal = useSelector(state => (state.jobs.upworkProposals && jobId ? state.jobs.upworkProposals[jobId] : { text: '', locked: false }));

// useEffect(() => {
//   setEditableProposal(jobProposal.text || "");
// }, [jobProposal.text]);

  
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
      //   if (!res.ok) throw new Error("Job not found");
      //   return res.json();
      // })
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
    setSaving(true);
  }
}, [jobFromRedux, id]);
if (loadingJob) {
  return <div className="p-8">Loading job details...</div>;
}
if (jobError) {
  return <div className="p-8">{jobError}</div>;
}
if (!localJob) {
  return null;
}

useEffect(() => {
  setEditableProposal(upworkProposalState.text || "");
  if (upworkProposalState.text) setShowProposalUI(false);
}, [upworkProposalState.text]);

useEffect(() => {
  // Reset proposalLoading when job changes or component unmounts
  return () => {
    dispatch(setUpworkProposalLoading(false));
  };
}, [id, dispatch]);

useEffect(() => {
  if (upworkProposalState.text) {
    setShowProposalUI(false);
  }
}, [upworkProposalState.text]);

// if (loading) {
  //   return <div className="p-8">Loading job details...</div>;
  // }
  // if (!job) {
  //   return <div className="p-8">No job details found.</div>;
  // }
  
//   // Sync local state with job object
//  useEffect(() => {
//   if (!job && id) {
//     dispatch(fetchJobByIdThunk(id));
//   }
// }, [job, id, dispatch]);

// if (loading) {
//   return <div className="p-8">Loading job details...</div>;
// }
// if (!job) {
//   return <div className="p-8">No job details found.</div>;
// }

const handleGenerateProposal = async (e) => {
  e.preventDefault();
  if (!proposalCategory) return;
  await dispatch(generateUpworkProposalThunk({ jobId, selectedCategory: proposalCategory }));
};

const handleSaveProposal = async () => {
  if (!editableProposal.trim()) return;
  await dispatch(updateUpworkProposalThunk({ jobId, proposal: editableProposal.trim() }));
  setIsEditingProposal(false);
};

const handleSaveAeRemark = async (e) => {
  e.preventDefault();
  if (!selectedUser || !selectedStatus) return;
  setSaving(true);
  const jobId = localJob.jobId || localJob.id;
  console.log('jobId', jobId);
  try {
    await dispatch(updateUpworkAeCommentThunk({ jobId, ae_comment: aeRemarkInput })).unwrap();
    await dispatch(upworkfetchJobByIdThunk(jobId)).unwrap();
    setAeRemarkInput("");
  } catch (err) {
    alert("Failed to save AE Remark.");
  } finally {
    setSaving(false);
  }
};
  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedStatus) return;
    setSaving(true);
    const jobId = localJob.jobId || localJob.id;
    try {
      console.log('Dispatching updateUpworkJobStatusThunk', { jobId, status: selectedStatus, username: selectedUser });
      await dispatch(updateUpworkJobStatusThunk({jobId, status: selectedStatus, username: selectedUser })).unwrap();
      console.log('Dispatched successfully');
      await dispatch(upworkfetchJobByIdThunk(jobId));
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setSaving(false);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentUser || !comment.trim()) return;
    setCommentLoading(true);
    const jobId = localJob.jobId || localJob.id;
    console.log('jobId', jobId);
    try {
      console.log('Dispatching addUpworkJobCommentThunk', { jobId, username: commentUser, comment });
      await dispatch(addUpworkJobCommentThunk({ jobId, username: commentUser, comment })).unwrap();
      console.log('Dispatched successfully');
      await dispatch(upworkfetchJobByIdThunk(jobId));
      setComment("");
      setCommentUser("");
    } catch (err) {
      alert("Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleSaveUpworkAeScore = async (e) => {
    e.preventDefault();
    setAeScoreSaving(true);
    setAeScoreError("");
    try {
      const value = Number(aeScoreInput);
      if (!aeScoreUser) {
        setAeScoreError("Please select a user.");
        setAeScoreSaving(false);
        return;
      }
      if (isNaN(value) || value < 0 || value > 100) {
        setAeScoreError("Please enter a valid score (0-100).");
        setAeScoreSaving(false);
        return;
      }
      await dispatch(updateUpworkAeScoreThunk({ jobId: localJob.jobId || localJob.id, username: aeScoreUser, ae_score: value })).unwrap();
      setAeScoreInput(value);
      console.log(localJob.ae_score);
      
    } catch (err) {
      setAeScoreError("Failed to save AE Score.");
    } finally {
      setAeScoreSaving(false);
    }
  };
  const handleSaveAePitched = async (e) => {
    e.preventDefault();
    setAePitchedSaving(true);
    setAePitchedError("");
    try {
      if (!aePitchedInput.trim()) {
        setAePitchedError("Please enter a value.");
        setAePitchedSaving(false);
        return;
      }
      await dispatch(updateUpworkAePitchedThunk({ jobId: localJob.jobId || localJob.id, ae_pitched: aePitchedInput.trim() })).unwrap();
      setAePitchedInput(aePitchedInput.trim());
    } catch (err) {
      setAePitchedError("Failed to save AE Pitched.");
    } finally {
      setAePitchedSaving(false);
    }
  };

  const handleSaveEstimatedBudget = async (e) => {
    e.preventDefault();
    setBudgetSaving(true);
    setBudgetError("");
    try {
      const value = Number(estimatedBudgetInput);
      if (isNaN(value) || value <= 0) {
        setBudgetError("Please enter a valid number.");
        setBudgetSaving(false);
        return;
      }
      await dispatch(updateUpworkEstimatedBudgetThunk({ jobId: localJob.jobId || localJob.id, estimated_budget: value })).unwrap();
      setEstimatedBudgetInput(value);
    } catch (err) {
      setBudgetError("Failed to save estimated budget.");
    } finally {
      setBudgetSaving(false);
    }
  };

  if (!localJob) {
    return <div className="p-8">No job details found.</div>;
  }

  const tierColorClass = badgeClass.tier[localJob.tier] || badgeClass.tier.Default;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <button
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Jobs
        </button>
       
        {/* Job Overview Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Overview</h2>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">{localJob.title}</h1>
            {localJob.tier && (
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass}`} title="Tier">
                  {localJob.tier === 'Green' ? 'AI Recommended' :
                  localJob.tier === 'Yellow' ? 'Recommended' :
                  localJob.tier === 'Red' ? 'Not Recommended' : localJob.tier}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {localJob.jobType && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-300">{localJob.jobType}</span>}
            {localJob.occupation && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-indigo-100 text-indigo-800 border-indigo-300">{localJob.occupation}</span>}
            {localJob.level && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">{localJob.level}</span>}
            {localJob.contractorTier && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">{localJob.contractorTier}</span>}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
          {/* <span className="font-bold">
  Project Length:{" "}
  {(() => {
    const weeks = localJob.hourlyWeeks;
    if (weeks === null || weeks === undefined || weeks < 4) return "Less than 1 month";
    if (weeks >= 4 && weeks < 13) return "1 to 3 months";
    if (weeks >= 13 && weeks < 25) return "3 to 6 months";
    if (weeks >= 25) return "More than 6 months";
    return "-";
  })()}
</span> */}

            <span className="font-bold">Country: {localJob.country || '-'}</span>
            <span className="font-bold">Industry: {localJob.companyIndustry || '-'}</span>
            <span className="font-bold">Company Size: {localJob.companySize || '-'}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
            <span className="font-bold">Job Type: {localJob.jobType || '-'}</span>
            <span className="font-bold">Hourly Type: {localJob.hourlyType || '-'}</span>
            <span className="font-bold">Hourly Weeks: {localJob.hourlyWeeks || '-'}</span>
            <span className="font-bold">Min Rate: {localJob.minHourlyRate ? `$${localJob.minHourlyRate}` : '-'}</span>
            <span className="font-bold">Max Rate: {localJob.maxHourlyRate ? `$${localJob.maxHourlyRate}` : '-'}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
            <a href={localJob.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View on Upwork</a>
          </div>
        </section>
        {/* Company Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">About the Company</h2>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span><span className="font-bold">Company:</span> {localJob.companyName || '-'}</span>
            <span><span className="font-bold">Industry:</span> {localJob.companyIndustry || '-'}</span>
            <span><span className="font-bold">Size:</span> {localJob.companySize || '-'}</span>
          </div>
        </section>
        {/* Job Description Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Description</h2>
          <div className="prose prose-sm max-w-none whitespace-pre-line mb-2">{localJob.description}</div>
        </section>
        {/* Skills Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(localJob.skills) && localJob.skills.length > 0 ? (
              localJob.skills.map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">{skill}</span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No skills listed.</span>
            )}
          
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span><span className="font-bold">Client History: buyerTotalJobsWithHires </span> {localJob.buyerTotalJobsWithHires === null || localJob.buyerTotalJobsWithHires === undefined
              ? "No hires"
              : localJob.buyerTotalJobsWithHires 
             }</span>
          </div>
          </div>
        </section>
        {/* KPIs Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">KPIs</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
                { label: 'Budget Attractiveness', value: localJob.kpi_budget_attractiveness },
              { label: 'Avg Hourly Rate', value: localJob.kpi_avg_hourly_rate },
              { label: 'Contract to Hire', value: localJob.kpi_contract_to_hire },
              { label: 'Enterprise Heuristic', value: localJob.kpi_enterprise_heuristic },
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
                <div key={label} className="flex items-center gap-2">
                  <span className="font-semibold w-32 inline-block">{label}:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${color} min-w-[36px] text-center`}>{value !== undefined && value !== '' ? value : '-'}</span>
                </div>
              );
            })}
            {/* AI Score as percentage, no badge or color tag */}
            <div className="flex items-center gap-2">
              <span className="font-semibold w-32 inline-block">AI Score:</span>
              <span className="text-xs font-bold min-w-[36px] text-center">{localJob.final_weighted_score !== undefined && localJob.final_weighted_score !== '' ? `${Math.round(parseFloat(localJob.final_weighted_score) * 100)}%` : '-'}</span>
            </div>
          </div>
        </section>
         {/* Status Management Section */}
         <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Status Management</h2>
          <form onSubmit={handleSaveStatus} className="flex flex-col gap-2 mb-2 md:flex-row md:items-center">
            <select
              className="border rounded px-2 py-1"
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {USER_LIST.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded"
              // disabled={saving || !selectedUser || !selectedStatus}
            >
              { "Save"}
            </button>
          </form>
          {/* Show current status */}
          <div className="mb-2">
            <span className="font-semibold">Current Status:</span>{" "}
            <span className="px-2 py-1 rounded bg-gray-100">
              {(localJob.currentStatus || "-").replace(/_/g, " ")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Status History:</span>
            <ul className="mt-1 space-y-1">
              {Array.isArray(localJob.statusHistory) && localJob.statusHistory.length === 0 ? (
                <li className="text-gray-400 text-sm">No status history.</li>
              ) : (
                Array.isArray(localJob.statusHistory) && localJob.statusHistory.map((entry, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-semibold">{entry.username}</span> set status to{" "}
                    <span className="px-2 py-0.5 rounded bg-gray-200">
                      {(entry.status || "-").replace(/_/g, " ")}
                    </span>{" "}
                    <span className="text-xs text-gray-500">
                      ({entry.date ? new Date(entry.date).toLocaleString() : "-"})
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

     {/* AE Score Section */}
<section className="mb-6 border-b pb-4">
  <h2 className="text-lg font-bold mb-3 text-gray-800">AE Score</h2>
  {localJob.ae_score ? (
    <div className="bg-green-50 border border-green-200 rounded p-3 text-green-900">
      <span className="font-semibold">AI Score:</span> {localJob.ae_score}
    </div>
  ) : (
    <form onSubmit={handleSaveUpworkAeScore} className="flex flex-col gap-2 mb-2">
      <select
        className="border rounded px-2 py-1"
        value={aeScoreUser}
        onChange={e => setAeScoreUser(e.target.value)}
        required
      >
        <option value="">Select User</option>
        {USER_LIST.map(user => (
          <option key={user} value={user}>{user}</option>
        ))}
      </select>
      <input
        type="number"
        className="border rounded px-2 py-1 w-full"
        placeholder="Enter AE Score (0-100)"
        value={aeScoreInput}
        onChange={e => setAeScoreInput(e.target.value)}
        disabled={aeScoreSaving}
        min={0}
        max={100}
        required
      />
      <button
        type="submit"
        className="self-start px-4 py-1 bg-blue-600 text-white rounded"
        disabled={aeScoreSaving || !aeScoreUser || !aeScoreInput}
      >
        {aeScoreSaving ? "Saving..." : "Save"}
      </button>
      {aeScoreError && <div className="text-red-500 text-sm">{aeScoreError}</div>}
    </form>
  )}
</section>
      {/* AE Pitched Section */}
<section className="mb-6 border-b pb-4">
  <h2 className="text-lg font-bold mb-3 text-gray-800">AE Pitched</h2>
  {localJob.ae_pitched ? (
    <div className="bg-green-50 border border-green-200 rounded p-3 text-green-900">
      <span className="font-semibold">AE Pitched:</span> {localJob.ae_pitched}
    </div>
  ) : (
    <form onSubmit={handleSaveAePitched} className="flex flex-col gap-2 mb-2">
      <textarea
        className="border rounded px-2 py-1 w-full"
        rows={2}
        placeholder="Write AE Pitched..."
        value={aePitchedInput}
        onChange={e => setAePitchedInput(e.target.value)}
        disabled={aePitchedSaving}
        required
      />
      <button
        type="submit"
        className="self-start px-4 py-1 bg-blue-600 text-white rounded"
        disabled={aePitchedSaving || !aePitchedInput.trim()}
      >
        {aePitchedSaving ? "Saving..." : "Save"}
      </button>
      {aePitchedError && <div className="text-red-500 text-sm">{aePitchedError}</div>}
    </form>
  )}
</section>

{/* Estimated Budget Section */}
<section className="mb-6 border-b pb-4">
  <h2 className="text-lg font-bold mb-3 text-gray-800">Estimated Budget</h2>
  {localJob.estimated_budget ? (
    <div className="bg-green-50 border border-green-200 rounded p-3 text-green-900">
      <span className="font-semibold">Estimated Budget:</span> ${localJob.estimated_budget}
    </div>
  ) : (
    <form onSubmit={handleSaveEstimatedBudget} className="flex flex-col gap-2 mb-2">
      <input
        type="number"
        className="border rounded px-2 py-1 w-full"
        placeholder="Enter estimated budget"
        value={estimatedBudgetInput}
        onChange={e => setEstimatedBudgetInput(e.target.value)}
        disabled={budgetSaving}
        min={1}
        required
      />
      <button
        type="submit"
        className="self-start px-4 py-1 bg-blue-600 text-white rounded"
        disabled={budgetSaving || !estimatedBudgetInput}
      >
        {budgetSaving ? "Saving..." : "Save"}
      </button>
      {budgetError && <div className="text-red-500 text-sm">{budgetError}</div>}
    </form>
  )}
</section>
        {/* AI Remark Section */}
        {localJob.ai_remark && (
          <section className="mb-6 border-b pb-4">
            <h2 className="text-lg font-bold mb-3 text-gray-800">AI Remark</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-line mb-2 text-blue-900 bg-blue-50 p-3 rounded border border-blue-200">
              {localJob.ai_remark}
            </div>
          </section>
        )}
         {/* AE Remark Section */}
         <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">AE Remark</h2>
          {!localJob.ae_comment ? (
            <form onSubmit={handleSaveAeRemark} className="flex flex-col gap-2 mb-2">
              <textarea
                className="border rounded px-2 py-1 w-full"
                rows={2}
                placeholder="Write AE Remark..."
                value={aeRemarkInput}
                onChange={e => setAeRemarkInput(e.target.value)}
                disabled={savingAeRemark}
              />
              <button
                type="submit"
                className="self-start px-4 py-1 bg-blue-600 text-white rounded"
                disabled={saving || !aeRemarkInput.trim()}
              >
                {savingAeRemark ? "Saving..." : "Save"}
              </button>
            </form>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-900">
              <span className="font-semibold">Saved AE Remark:</span>
              <div>{localJob.ae_comment}</div>
            </div>
          )}
        </section>
        {/* Comments Section */}
        <form onSubmit={handleAddComment} className="mb-4 flex flex-col md:flex-row gap-2 items-center">
          <select
            className="border rounded px-2 py-1"
            value={commentUser}
            onChange={e => setCommentUser(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {USER_LIST.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border px-2 py-1 rounded w-full"
            // disabled={commentLoading}
            required
          />
          <button
            type="submit"
            className="px-4 py-1 bg-blue-600 text-white rounded"
            disabled={commentLoading || !commentUser || !comment.trim()}
          >
            {commentLoading ? "Saving..." : "Add"}
      </button>
        </form>
        <ul className="mb-4">
            {Array.isArray(localJob.comments) && localJob.comments.length > 0 ? (
            localJob.comments.map((c, idx) => (
              <li key={idx} className="text-sm text-gray-700 mb-1">
                <span className="font-semibold">{c.username}:</span> {c.comment}
                {c.date && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({new Date(c.date).toLocaleString()})
                  </span>
                )}
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-400">No comments yet.</li>
          )}
        </ul>
        <section className="mb-6 border-b pb-4">
  <h2 className="text-lg font-bold mb-3 text-gray-800">Generate Proposal</h2>
  {showProposalUI ? (
    <form onSubmit={handleGenerateProposal} className="flex flex-col gap-2 mb-2">
      <select
        className="border rounded px-2 py-1"
        value={proposalCategory}
        onChange={e => setProposalCategory(e.target.value)}
        required
      >
        <option value="">Select Service Category</option>
        {UPWORK_SERVICE_CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button
        type="submit"
        className="self-start px-4 py-1 bg-blue-600 text-white rounded"
        disabled={upworkProposalLoading || !proposalCategory}
      >
        {upworkProposalLoading ? "Generating..." : "Generate Proposal"}
      </button>
      {upworkProposalError && <div className="text-red-500 text-sm">{upworkProposalError}</div>}
    </form>
  ) : (
    <div>
      <label className="block font-semibold mb-1">Generated Proposal:</label>
      <textarea
        className="border rounded px-2 py-1 w-full"
        rows={8}
        value={isEditingProposal ? editableProposal : upworkProposalState.text}
        onChange={e => setEditableProposal(e.target.value)}
        readOnly={!isEditingProposal}
      />
      <div className="flex gap-2 mt-2">
  {!isEditingProposal && !upworkProposalState.locked && (
    <button
      className="px-4 py-1 bg-yellow-500 text-white rounded"
      onClick={() => setIsEditingProposal(true)}
    >
      Edit
    </button>
  )}
  {isEditingProposal && (
    <>
      <button
        className="px-4 py-1 bg-blue-600 text-white rounded"
        onClick={handleSaveProposal}
        disabled={upworkProposalSaving}
      >
        {upworkProposalSaving ? "Saving..." : "Save"}
      </button>
      <button
        className="px-4 py-1 bg-gray-400 text-white rounded"
        onClick={() => {
          setEditableProposal(upworkProposalState.text || "");
          setIsEditingProposal(false);
        }}
        disabled={upworkProposalSaving}
      >
        Cancel
      </button>
    </>
  )}
</div>
      {upworkProposalSaveError && <div className="text-red-500 text-sm">{upworkProposalSaveError}</div>}
    </div>
  )}
</section>
      
        {/* Raw JSON for debugging
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-gray-400">Raw Job Data</summary>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(localJob, null, 2)}</pre>
        </details> */}
      </div>
    </div>
  );
};

export default UpworkJobDetails;