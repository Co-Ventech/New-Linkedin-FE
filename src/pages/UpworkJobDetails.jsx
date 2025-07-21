import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const job = location.state?.job;

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