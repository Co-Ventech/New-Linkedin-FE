import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateJobStatusThunk, fetchJobsByDateThunk, addJobCommentThunk } from "../slices/jobsSlice";

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

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState("");
  const [engaged, setEngaged] = useState("");
  const [engagedBy, setEngagedBy] = useState( "");

  const [toggleLoading, setToggleLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const range = useSelector(state => state.jobs.range);
  const jobsByDate = useSelector(state => state.jobs.jobsByDate);
  const allJobs = jobsByDate.flatMap(day => day.jobs || []);
  // const [aeRemark, setAeRemark] = useState(job.ae_remark || "");
  const [aeRemark, setAeRemark] = useState("");
  const [aeRemarkInput, setAeRemarkInput] = useState("");
  const [saving, setSaving] = useState(false);


  const userList = ["khubaib", "Taha","Basit" , "huzaifa" , "abdulrehman"]; 


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
  const job = allJobs.find(j => String(j.id) === String(id));
  console.log("Redux job status:", job?.status);

  const handleToggleEngaged = async (e) => {
    const newEngaged = e.target.checked;
    setToggleLoading(true);
    try {
      const payload = { status: newEngaged ? "engaged" : "not_engaged" };
      console.log("Sending PATCH payload:", payload);
      await dispatch(updateJobStatusThunk({ jobId: job.id, status: payload.status })).unwrap();
      await dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 }));
    } catch (err) {
      alert("Failed to update job status.");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleSaveAeRemark = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: Replace with your backend endpoint and job.id
      // Example:
      // await axios.post(`/api/jobs/${job.id}/ae-remark`, { remark: aeRemarkInput });
      setAeRemark(aeRemarkInput); // Optimistic update
      setAeRemarkInput("");
    } catch (err) {
      alert("Failed to save AE Remark.");
    } finally {
      setSaving(false);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      await dispatch(addJobCommentThunk({ jobId: job.id, comment })).unwrap();
      await dispatch(fetchJobsByDateThunk({ range, page: 1, limit: 1000 })); // Refetch jobs to update UI
      setComment("");
    } catch (err) {
      alert("Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (!job) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Job not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <button
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          &larr; Back to Jobs
        </button>
        <section className="mb-4">
        {!selectedUser && (
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
        )}

        {/* Engaged Toggle Switch */}
        {selectedUser && (
          <div className="flex items-center gap-2 mt-2">
            <label className="font-semibold">Engaged:</label>
            <input
              type="checkbox"
              checked={engaged}
              onChange={async (e) => {
                setToggleLoading(true);
                try {
                  // TODO: Call backend to update status
                  setEngaged(e.target.checked);
                  setEngagedBy(e.target.checked ? selectedUser : "");
                } catch (err) {
                  alert("Failed to update job status.");
                } finally {
                  setToggleLoading(false);
                }
              }}
              disabled={toggleLoading}
            />
            {toggleLoading && <span className="text-xs text-gray-400 ml-2">Saving...</span>}
          </div>
        )}

        {/* Show engaged message */}
        {engaged && engagedBy && (
          <div className="mt-2 text-green-700 font-semibold">
            {engagedBy} engaged with this job
          </div>
        )}
      </section>

        
        {/* Job Overview Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Overview</h2>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">{job.title}</h1>
            {job.tier && (
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${badgeClass.tier[job.tier] || badgeClass.tier.Default}`} title="Tier">{job.tier}</span>
            )}
          </div>
          {/* Location display */}
          {job.locations && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-bold">Location:</span> {(() => {
                if (Array.isArray(job.locations)) {
                  if (typeof job.locations[0] === 'object' && job.locations[0] !== null && 'country' in job.locations[0]) {
                    return job.locations.map(loc => [loc.city, loc.state, loc.country].filter(Boolean).join(', ')).join(' | ');
                  }
                  // If array of strings
                  return job.locations.join(' | ');
                }
                // If single string
                return job.locations;
              })()}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {job.employmentType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">{job.employmentType}</span>}
            {job.workplaceType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">{job.workplaceType}</span>}
            {job.applicants && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">{job.applicants} Applicants</span>}
            {job.views && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">{job.views} Views</span>}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
            <span className="font-bold">Posted: {job.postedDate ? new Date(job.postedDate).toLocaleString() : '-'}</span>
            {job.expireAt && <span className="font-bold">Expires: {new Date(job.expireAt).toLocaleString()}</span>}
            <span><span className="font-bold">Salary:</span> {job.salary || '-'}</span>
          </div>
        </section>
        {/* Company Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">About the Company</h2>
          <div className="flex items-center gap-2 mb-2">
            {job.companyLogo && (
              <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
                <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded object-contain border border-gray-200" />
              </a>
            )}
            <span className="font-bold text-xs text-gray-700">Company:</span>
            <span className="text-xs text-gray-800 font-semibold truncate">{job.company || 'Company'}</span>
            {job.companyWebsite && (
              <a href={job.companyWebsite} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">Website</a>
            )}
            {job.companyUrl && (
              <a href={job.companyUrl} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span><span className="font-bold">Size:</span> {job.companyEmployeeCount || '-'}</span>
            <span><span className="font-bold">Followers:</span> {job.companyFollowerCount || '-'}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span className="line-clamp-2 max-w-full"><span className="font-bold">Industry:</span> {Array.isArray(job.companyIndustries) ? job.companyIndustries.join(', ') : job.companyIndustries || '-'}</span>
            <span className="line-clamp-2 max-w-full"><span className="font-bold">Specialities:</span> {Array.isArray(job.companySpecialities) ? job.companySpecialities.join(', ') : job.companySpecialities || '-'}</span>
          </div>
          <div className="mb-2"><span className="font-bold">Description:</span> {job.companyDescription || '-'}</div>
        </section>
        {/* Job Description Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Description</h2>
          <div className="prose prose-sm max-w-none whitespace-pre-line mb-2">{job.descriptionText}</div>
          <div className="flex gap-4 mt-2">
            <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Job</a>
            {job.easyApplyUrl && (
              <a href={job.easyApplyUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">Easy Apply</a>
            )}
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
        {!aeRemark ? (
          <form onSubmit={handleSaveAeRemark} className="flex flex-col gap-2 mb-2">
            <textarea
              className="border rounded px-2 py-1 w-full"
              rows={2}
              placeholder="Write AE Remark..."
              value={aeRemarkInput}
              onChange={e => setAeRemarkInput(e.target.value)}
              disabled={saving}
            />
            <button
              type="submit"
              className="self-start px-4 py-1 bg-blue-600 text-white rounded"
              disabled={saving || !aeRemarkInput.trim()}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-blue-900">
            <span className="font-semibold">Saved AE Remark:</span>
            <div>{aeRemark}</div>
          </div>
        )}
      </section>
        {/* KPIs Section */}
        <section className="mb-2">
          <h2 className="text-lg font-bold mb-3 text-gray-800">KPIs</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'JD Quality', value: job.kpi_jd_quality },
              { label: 'Domain Fit', value: job.kpi_domain_fit },
              { label: 'Seniority Alignment', value: job.kpi_seniority_alignment },
              { label: 'Location Priority', value: job.kpi_location_priority },
              { label: 'Company Specialties', value: job.kpi_company_specialties },
              { label: 'Salary', value: job.kpi_salary },
              { label: 'Company Size', value: job.kpi_company_size },
              { label: 'Company Popularity', value: job.kpi_company_popularity },
              { label: 'Industry Match', value: job.kpi_industry_match },
              { label: 'Job Popularity', value: job.kpi_job_popularity },
              { label: 'Job Freshness', value: job.kpi_job_freshness },
              { label: 'Employment Type', value: job.kpi_employment_type },
              { label: 'Contact Info', value: job.kpi_contact_info },
              { label: 'Skills Explicitness', value: job.kpi_skills_explicitness },
              { label: 'Experience Threshold', value: job.kpi_experience_threshold },
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
              <span className="text-xs font-bold min-w-[36px] text-center">{job.final_score !== undefined && job.final_score !== '' ? `${Math.round(parseFloat(job.final_score) * 100)}%` : '-'}</span>
            </div>
          </div>
        </section>
        {/* Comment Box */}
        <form onSubmit={handleAddComment} className="mb-4">
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="border px-2 py-1 rounded w-2/3"
            disabled={commentLoading}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-1 bg-blue-600 text-white rounded"
            disabled={commentLoading}
          >
            {commentLoading ? "Saving..." : "Add"}
          </button>
        </form>
        <ul className="mb-4">
          {Array.isArray(job.comments) && job.comments.length > 0 ? (
            job.comments.map((c, idx) => (
              <li key={idx} className="text-sm text-gray-700 mb-1">- {c}</li>
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