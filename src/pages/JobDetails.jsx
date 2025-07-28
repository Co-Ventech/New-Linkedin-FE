const REMOTE_HOST = import.meta.env.VITE_REMOTE_HOST;
const PORT = import.meta.env.VITE_PORT;
const API_BASE = `${REMOTE_HOST}:${PORT}/api`;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateJobStatusThunk, fetchJobsByDateThunk, addJobCommentThunk,updateAeCommentThunk  } from "../slices/jobsSlice";

const tierColor = (tier) => {
  if (!tier) return "bg-gray-200 text-gray-700";
  if (tier.toLowerCase() === "yellow") return "bg-yellow-200 text-yellow-800";
  if (tier.toLowerCase() === "green") return "bg-green-200 text-green-800";
  if (tier.toLowerCase() === "red") return "bg-red-200 text-red-800";
  return "bg-gray-200 text-gray-700";
};

const badgeClass = {
  tier: {
    Yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400',
    Green: 'bg-green-200 text-green-800 border-green-400',
    Red: 'bg-red-200 text-red-800 border-red-400',
    Default: 'bg-gray-200 text-gray-700 border-gray-300',
  },
  jobType: 'bg-blue-100 text-blue-800 border-blue-300',
  workplace: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  applicants: 'bg-green-100 text-green-800 border-green-300',
  views: 'bg-orange-100 text-orange-800 border-orange-300',
};

// KPI badge color logic
const getKpiBadge = (score) => {
  if (typeof score !== 'number') score = parseFloat(score);
  if (isNaN(score)) return { color: 'bg-gray-200 text-gray-700 border-gray-300', tag: '' };
  if (score >= 0.7) return { color: 'bg-green-100 text-green-800 border-green-400', tag: 'Green' };
  if (score >= 0.5) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-400', tag: 'Yellow' };
  return { color: 'bg-red-100 text-red-800 border-red-400', tag: 'Red' };
};


// async function fetchJobById(jobId) {
//   const res = await axios.get(`${API_BASE}/jobs/${jobId}`, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     },
//   });
//   return res.data;
// }
const STATUS_OPTIONS = [
  'not_engaged', 'applied', 'engaged', 'interview', 'offer', 'rejected', 'archived'
];

const USER_LIST = ["khubaib", "Taha", "Basit", "huzaifa", "abdulrehman"];

const JobDetails = () => {
  const { id } = useParams();
  const jobsByDate = useSelector(state => state.jobs.jobsByDate);
  const jobFromRedux = jobsByDate.flatMap(day => day.jobs || []).find(j => String(j.id) === String(id));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const range = useSelector(state => state.jobs.range);
  // const jobsByDate = useSelector(state => state.jobs.jobsByDate);
  const allJobs = jobsByDate.flatMap(day => day.jobs || []);
  const job = allJobs.find(j => String(j.id) === String(id));
  const [ae_comment, setAe_comment] = useState("");
  const [ae_commentInput, setAe_commentInput] = useState("");
  const [commentUser, setCommentUser] = useState("");
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("not_engaged");
  const [saving, setSaving] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(job?.currentStatus || "not_engaged");
  const [statusHistory, setStatusHistory] = useState(job?.statusHistory || []);

const [localJob, setLocalJob] = useState(jobFromRedux || null);
const [loadingJob, setLoadingJob] = useState(false);
const [jobError, setJobError] = useState(null);



  // Log the first job object to inspect structure
  console.log("First job object in jobsByDate:", allJobs[0]);
  // Log all job objects that match the ID in any way
  allJobs.forEach(j => {
    if (String(j.id) === String(id)) {
      console.log("MATCHED BY j.id:", j);
    }
    if (j.job && String(j.job.id) === String(id)) {
      console.log("MATCHED BY j.job.id:", j.job);
    }
  });
  console.log("Looking for job ID:", id);
  console.log("jobsByDate after refetch:", jobsByDate);
  console.log("Redux job status:", localJob?.status);   

  useEffect(() => {
    if (localJob) {
      setCurrentStatus(localJob.currentStatus || "not_engaged");
      setStatusHistory(Array.isArray(localJob.statusHistory) ? localJob.statusHistory : []);
      setSelectedStatus(localJob.currentStatus || "not_engaged");
      // setAe_comment(job.ae_comment || "");
    }
  }, [localJob]);

  useEffect(() => {
    if (!jobFromRedux && id) {
      setLoadingJob(true);
      setJobError(null);
      axios.get(`${API_BASE}/apify/job?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
        .then(res => {
          setLocalJob(res.data);
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

  if (loadingJob) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading job...</div>;
  }
  if (jobError) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">{jobError}</div>;
  }
  if (!localJob || Object.keys(localJob).length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Job not found.</div>;
  }

  console.log("localJob:", localJob);
  console.log("job:", job);
  console.log("jobFromRedux:", jobFromRedux);
  // const handleSaveStatus = async (e) => {
  //   e.preventDefault();
  //   if (!selectedUser || !selectedStatus) return;
  //   setSaving(true);
  //   try {
  //     await axios.patch(
  //       `${API_BASE}/jobs/${id}`,
  //       {
  //         status: selectedStatus,
  //         username: selectedUser,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     await loadJob(); // Refresh job data after update
  //   } catch (err) {
  //     alert("Failed to update status.");
  //   } finally {
  //     setSaving(false);
  //   }
  // };


  // const handleToggleEngaged = async (e) => {
  //   const newEngaged = e.target.checked;
  //   setToggleLoading(true);
  //   try {
  //     const payload = { status: newEngaged ? "engaged" : "not_engaged" };
  //     console.log("Sending PATCH payload:", payload);
  //     await dispatch(updateJobStatusThunk({ jobId: job.id, status: payload.status })).unwrap();
  //     await dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
  //   } catch (err) {
  //     alert("Failed to update job status.");
  //   } finally {
  //     setToggleLoading(false);
  //   }
  // };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    console.log("handleSaveStatus called", { selectedUser, selectedStatus, jobId: job?.id });
    if (!selectedUser || !selectedStatus) return;
    setSaving(true);
    try {
      // This should trigger the API call
      await dispatch(updateJobStatusThunk({ jobId: localJob.id, status: selectedStatus, username: selectedUser })).unwrap();
      await dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
    } catch (err) {
      alert("Failed to update status.");
      console.error("handleSaveStatus error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAeRemark = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    await dispatch(updateAeCommentThunk({ jobId: localJob.id, ae_comment: ae_commentInput })).unwrap();
    await dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
    setAe_comment(ae_commentInput); 
    setAe_commentInput("");
  } catch (err) {
    alert("Failed to save AE Remark.");
  } finally {
   // setSaving(false);
  }
};
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentUser || !comment.trim()) return;
    setCommentLoading(true);
    try {
      await dispatch(addJobCommentThunk({ jobId: localJob.id, username: commentUser, comment })).unwrap();
      await dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
      setComment("");
      setCommentUser("");
    } catch (err) {
      alert("Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (!localJob) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Job not found.</div>;

  return (

    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <button
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Jobs
        </button>

       
        {/* <section className="mb-4"> */}
        {/* {!selectedUser && (
          <div className="flex items-center gap-2">
            <label className="font-semibold">Select User:</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              <option value="">-- Select --</option>
              {userList.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
        )} */}

        {/* Engaged Toggle Switch */}
        {/* {selectedUser && (
          // <div className="flex items-center gap-2 mt-2">
          //   <label className="font-semibold">Engaged:</label>
          //   <input
          //     type="checkbox"
          //     checked={engaged}
          //     onChange={async (e) => {
          //       setToggleLoading(true);
          //       try {
          //         // TODO: Call backend to update status
          //         setEngaged(e.target.checked);
          //         setEngagedBy(e.target.checked ? selectedUser : "");
          //       } catch (err) {
          //         alert("Failed to update job status.");
          //       } finally {
          //         setToggleLoading(false);
          //       }
          //     }}
          //     disabled={toggleLoading}
          //   />
          //   {toggleLoading && <span className="text-xs text-gray-400 ml-2">Saving...</span>}
          // </div>
        )} */}

        {/* Show engaged message */}
        {/* {engaged && engagedBy && (
          <div className="mt-2 text-green-700 font-semibold">
            {engagedBy} engaged with this job
          </div>
        )} */}
        {/* </section> */}


        {/* Job Overview Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Overview</h2>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">{localJob.title}</h1>
            {localJob.tier && (
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${badgeClass.tier[localJob.tier] || badgeClass.tier.Default}`} title="Tier">{localJob.tier}</span>
            )}
          </div>
          {/* Location display */}
          {localJob.locations && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-bold">Location:</span> {(() => {
                if (Array.isArray(localJob.locations)) {
                  if (typeof localJob.locations[0] === 'object' && localJob.locations[0] !== null && 'country' in localJob.locations[0]) {
                    return localJob.locations.map(loc => [loc.city, loc.state, loc.country].filter(Boolean).join(', ')).join(' | ');
                  }
                  // If array of strings
                  return localJob.locations.join(' | ');
                }
                // If single string
                return localJob.locations;
              })()}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {localJob.employmentType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">{localJob.employmentType}</span>}
            {localJob.workplaceType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">{localJob.workplaceType}</span>}
            {localJob.applicants && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">{localJob.applicants} Applicants</span>}
            {localJob.views && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">{localJob.views} Views</span>}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
            <span className="font-bold">Posted: {localJob.postedDate ? new Date(localJob.postedDate).toLocaleString() : '-'}</span>
            {localJob.expireAt && <span className="font-bold">Expires: {new Date(localJob.expireAt).toLocaleString()}</span>}
            <span><span className="font-bold">Salary:</span> {localJob.salary || '-'}</span>
          </div>
        </section>
        {/* Company Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">About the Company</h2>
          <div className="flex items-center gap-2 mb-2">
            {localJob.companyLogo && (
              <a href={localJob.companyUrl} target="_blank" rel="noopener noreferrer">
                <img src={localJob.companyLogo} alt={localJob.company?.name || localJob.company || 'Company'} className="w-12 h-12 rounded object-contain border border-gray-200" />
              </a>
            )}
            <span className="font-bold text-xs text-gray-700">Company:</span>
            <span className="text-xs text-gray-800 font-semibold truncate">
              {localJob.company?.name || localJob.company || 'Company'}
            </span>
            {localJob.company?.website && (
              <a href={localJob.company.website} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">Website</a>
            )}
            {localJob.company?.linkedinUrl && (
              <a href={localJob.company.linkedinUrl} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span><span className="font-bold">Size:</span> {localJob.company?.employeeCount || localJob.companyEmployeeCount || '-'}</span>
            <span><span className="font-bold">Followers:</span> {localJob.company?.followerCount || localJob.companyFollowerCount || '-'}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span className="line-clamp-2 max-w-full"><span className="font-bold">Industry:</span> {Array.isArray(localJob.company?.industries) ? localJob.company.industries.join(', ') : (Array.isArray(localJob.companyIndustries) ? localJob.companyIndustries.join(', ') : localJob.companyIndustries || '-')}</span>
            <span className="line-clamp-2 max-w-full"><span className="font-bold">Specialities:</span> {Array.isArray(localJob.company?.specialities) ? localJob.company.specialities.join(', ') : (Array.isArray(localJob.companySpecialities) ? localJob.companySpecialities.join(', ') : localJob.companySpecialities || '-')}</span>
          </div>
          <div className="mb-2"><span className="font-bold">Description:</span> {localJob.company?.description || localJob.companyDescription || '-'}</div>
        </section>
        {/* Job Description Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Description</h2>
          <div className="prose prose-sm max-w-none whitespace-pre-line mb-2">{localJob.descriptionText}</div>
          <div className="flex gap-4 mt-2">
            <a href={localJob.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Job</a>
            {localJob.easyApplyUrl && (
              <a href={localJob.easyApplyUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">Easy Apply</a>
            )}
          </div>
        </section>
       
        {/* KPIs Section */}
        <section className="mb-2">
          <h2 className="text-lg font-bold mb-3 text-gray-800">KPIs</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'JD Quality', value: localJob.kpi_jd_quality },
              { label: 'Domain Fit', value: localJob.kpi_domain_fit },
              { label: 'Seniority Alignment', value: localJob.kpi_seniority_alignment },
              { label: 'Location Priority', value: localJob.kpi_location_priority },
              { label: 'Company Specialties', value: localJob.kpi_company_specialties },
              { label: 'Salary', value: localJob.kpi_salary },
              { label: 'Company Size', value: localJob.kpi_company_size },
              { label: 'Company Popularity', value: localJob.kpi_company_popularity },
              { label: 'Industry Match', value: localJob.kpi_industry_match },
              { label: 'Job Popularity', value: localJob.kpi_job_popularity },
              { label: 'Job Freshness', value: localJob.kpi_job_freshness },
              { label: 'Employment Type', value: localJob.kpi_employment_type },
              { label: 'Contact Info', value: localJob.kpi_contact_info },
              { label: 'Skills Explicitness', value: localJob.kpi_skills_explicitness },
              { label: 'Experience Threshold', value: localJob.kpi_experience_threshold },
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
              <span className="text-xs font-bold min-w-[36px] text-center">{localJob.final_score !== undefined && localJob.final_score !== '' ? `${Math.round(parseFloat(localJob.final_score) * 100)}%` : '-'}</span>
            </div>
          </div>
        </section>
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
              {(currentStatus || "-").replace(/_/g, " ")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Status History:</span>
            <ul className="mt-1 space-y-1">
              {Array.isArray(statusHistory) && statusHistory.length === 0 ? (
                <li className="text-gray-400 text-sm">No status history.</li>
              ) : (
                Array.isArray(statusHistory) && statusHistory.map((entry, idx) => (
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
                value={ae_commentInput}
                onChange={e => setAe_commentInput(e.target.value)}
                disabled={saving}
              />
              <button
                type="submit"
                className="self-start px-4 py-1 bg-blue-600 text-white rounded"
                disabled={saving || !ae_commentInput.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </form>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-900">
              <span className="font-semibold">Saved AE Remark:</span>
                  <div>{localJob.ae_comment}</div>
            </div>
          )}
        </section>
        {/* Comment Box */}
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
    disabled={commentLoading}
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
      </div>
    </div>
  );
};

export default JobDetails;