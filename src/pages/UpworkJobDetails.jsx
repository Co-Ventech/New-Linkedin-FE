import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {useSelector, useDispatch } from "react-redux";
import { fetchUpworkJobsByDateThunk, updateUpworkJobStatusThunk , updateUpworkAeCommentThunk, addUpworkJobCommentThunk } from "../slices/jobsSlice";
// import { updateUpworkAeCommentThunk, updateUpworkJobStatusThunk, addUpworkJobCommentThunk } from "../slices/jobsSlice";
// await dispatch(updateUpworkJobStatusThunk({ jobId: job.id, status: ..., username:  }))
// const dispatch = useDispatch();



const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];
const STATUS_OPTIONS = [
  'not_engaged', 'applied', 'engaged', 'interview', 'offer', 'rejected', 'archived'
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
const job = useSelector(state =>
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
  const [selectedStatus, setSelectedStatus] = useState(job?.currentStatus || "not_engaged");
  const [commentUser, setCommentUser] = useState("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

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

  const handleSaveAeRemark = async (e) => {
    e.preventDefault();
    console.log("testing");
    if (!selectedUser || !selectedStatus) return;
    setSaving(true);
    console.log('job', job);
    console.log('job.jobId', job.jobId);
    try {
      await dispatch(updateUpworkAeCommentThunk({ jobId: job.jobId, ae_comment: aeRemarkInput })).unwrap();
      await dispatch(fetchUpworkJobsByDateThunk());
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
    console.log('job', job);
    console.log('job.jobId', job.jobId);
    try {
      await dispatch(updateUpworkJobStatusThunk({ jobId: job.jobId, status: selectedStatus, username: selectedUser })).unwrap();
      await dispatch(fetchUpworkJobsByDateThunk());
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
    try {
      await dispatch(addUpworkJobCommentThunk({ jobId: job.jobId, username: commentUser, comment })).unwrap();
      await dispatch(fetchUpworkJobsByDateThunk());
      
      setComment("");
      setCommentUser("");
    } catch (err) {
      alert("Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (!job) {
    return <div className="p-8">No job details found.</div>;
  }

  const tierColorClass = badgeClass.tier[job.tier] || badgeClass.tier.Default;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <button
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Jobs
        </button>
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
              disabled={saving || !selectedUser || !selectedStatus}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
          {/* Show current status */}
          <div className="mb-2">
            <span className="font-semibold">Current Status:</span>{" "}
            <span className="px-2 py-1 rounded bg-gray-100">
              {(job.currentStatus || "-").replace(/_/g, " ")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Status History:</span>
            <ul className="mt-1 space-y-1">
              {Array.isArray(job.statusHistory) && job.statusHistory.length === 0 ? (
                <li className="text-gray-400 text-sm">No status history.</li>
              ) : (
                Array.isArray(job.statusHistory) && job.statusHistory.map((entry, idx) => (
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
       
        {/* Job Overview Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Overview</h2>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">{job.title}</h1>
            {job.tier && (
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass}`} title="Tier">
                {job.tier === 'Green' ? 'AI Recommended' :
                  job.tier === 'Yellow' ? 'Recommended' :
                  job.tier === 'Red' ? 'Not Recommended' : job.tier}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {job.jobType && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-300">{job.jobType}</span>}
            {job.occupation && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-indigo-100 text-indigo-800 border-indigo-300">{job.occupation}</span>}
            {job.level && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">{job.level}</span>}
            {job.contractorTier && <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300">{job.contractorTier}</span>}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
          {/* <span className="font-bold">
  Project Length:{" "}
  {(() => {
    const weeks = job.hourlyWeeks;
    if (weeks === null || weeks === undefined || weeks < 4) return "Less than 1 month";
    if (weeks >= 4 && weeks < 13) return "1 to 3 months";
    if (weeks >= 13 && weeks < 25) return "3 to 6 months";
    if (weeks >= 25) return "More than 6 months";
    return "-";
  })()}
</span> */}

            <span className="font-bold">Country: {job.country || '-'}</span>
            <span className="font-bold">Industry: {job.companyIndustry || '-'}</span>
            <span className="font-bold">Company Size: {job.companySize || '-'}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
            <span className="font-bold">Job Type: {job.jobType || '-'}</span>
            <span className="font-bold">Hourly Type: {job.hourlyType || '-'}</span>
            <span className="font-bold">Hourly Weeks: {job.hourlyWeeks || '-'}</span>
            <span className="font-bold">Min Rate: {job.minHourlyRate ? `$${job.minHourlyRate}` : '-'}</span>
            <span className="font-bold">Max Rate: {job.maxHourlyRate ? `$${job.maxHourlyRate}` : '-'}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View on Upwork</a>
          </div>
        </section>
        {/* Company Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">About the Company</h2>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span><span className="font-bold">Company:</span> {job.companyName || '-'}</span>
            <span><span className="font-bold">Industry:</span> {job.companyIndustry || '-'}</span>
            <span><span className="font-bold">Size:</span> {job.companySize || '-'}</span>
          </div>
        </section>
        {/* Job Description Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Description</h2>
          <div className="prose prose-sm max-w-none whitespace-pre-line mb-2">{job.description}</div>
        </section>
        {/* Skills Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(job.skills) && job.skills.length > 0 ? (
              job.skills.map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded">{skill}</span>
              ))
            ) : (
              <span className="text-xs text-gray-400">No skills listed.</span>
            )}
          
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span><span className="font-bold">Client History: buyerTotalJobsWithHires </span> {job.buyerTotalJobsWithHires === null || job.buyerTotalJobsWithHires === undefined
              ? "No hires"
              : job.buyerTotalJobsWithHires 
             }</span>
          </div>
          </div>
        </section>
        {/* KPIs Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">KPIs</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'Budget Attractiveness', value: job.kpi_budget_attractiveness },
              { label: 'Avg Hourly Rate', value: job.kpi_avg_hourly_rate },
              { label: 'Contract to Hire', value: job.kpi_contract_to_hire },
              { label: 'Enterprise Heuristic', value: job.kpi_enterprise_heuristic },
              { label: 'Hiring Rate', value: job.kpi_hiring_rate },
              { label: 'Job Engagement', value: job.kpi_job_engagement },
              { label: 'Job Title Relevance', value: job.kpi_job_title_relevance },
              { label: 'Client Tenure', value: job.kpi_client_tenure },
              { label: 'Client Hiring History', value: job.kpi_client_hiring_history },
              { label: 'Client Active Assignments', value: job.kpi_client_active_assignments },
              { label: 'Client Feedback Volume', value: job.kpi_client_feedback_volume },
              { label: 'Client Open Jobs', value: job.kpi_client_open_jobs },
              { label: 'Skill Match', value: job.kpi_skill_match },
              { label: 'Weekly Hour Commitment', value: job.kpi_weekly_hour_commitment },
              { label: 'Client Rating', value: job.kpi_client_rating },
              { label: 'Client Activity Recency', value: job.kpi_client_activity_recency },
              { label: 'Payment Verification', value: job.kpi_payment_verification },
              { label: 'Job Level Match', value: job.kpi_job_level_match },
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
              <span className="text-xs font-bold min-w-[36px] text-center">{job.final_weighted_score !== undefined && job.final_weighted_score !== '' ? `${Math.round(parseFloat(job.final_weighted_score) * 100)}%` : '-'}</span>
            </div>
          </div>
        </section>
        {/* AI Remark Section */}
        {job.ai_remark && (
          <section className="mb-6 border-b pb-4">
            <h2 className="text-lg font-bold mb-3 text-gray-800">AI Remark</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-line mb-2 text-blue-900 bg-blue-50 p-3 rounded border border-blue-200">
              {job.ai_remark}
            </div>
          </section>
        )}
         {/* AE Remark Section */}
         <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">AE Remark</h2>
          {!job.ae_comment ? (
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
                // disabled={saving || !aeRemarkInput.trim()}
              >
                {savingAeRemark ? "Saving..." : "Save"}
              </button>
            </form>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-900">
              <span className="font-semibold">Saved AE Remark:</span>
              <div>{job.ae_comment}</div>
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
            // disabled={commentLoading || !commentUser || !comment.trim()}
          >
            {commentLoading ? "Saving..." : "Add"}
      </button>
        </form>
        <ul className="mb-4">
          {Array.isArray(job.comments) && job.comments.length > 0 ? (
            job.comments.map((c, idx) => (
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
        {/* Raw JSON for debugging
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-gray-400">Raw Job Data</summary>
          <pre className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(job, null, 2)}</pre>
        </details> */}
      </div>
    </div>
  );
};

export default UpworkJobDetails;