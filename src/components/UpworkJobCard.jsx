import { useNavigate } from "react-router-dom";
import React from "react";

const badgeClass = {
  tier: {
    Yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400',
    Green: 'bg-green-200 text-green-800 border-green-400',
    Red: 'bg-red-200 text-red-800 border-red-400',
    Default: 'bg-gray-200 text-gray-700 border-gray-300',
  },
  jobType: 'bg-blue-100 text-blue-800 border-blue-300',
  occupation: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  projectLength: 'bg-gray-100 text-gray-800 border-gray-300',
};

const UpworkJobCard = ({ job, view = "grid" }) => {
  const navigate = useNavigate();
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  // Defensive extraction
  const companyName = job.companyName || "-";
  const companyIndustry = job.companyIndustry || "-";
  const companySize = job.companySize || "-";
  const country = job.country || "-";
  const tier = job.tier || null;
  const tierColorClass = badgeClass.tier[tier] || badgeClass.tier.Default;
  const occupation = job.occupation || null;
  const jobType = job.jobType || null;
  const level = job.level || null;
  const contractorTier = job.contractorTier || null;
  const skills = Array.isArray(job.skills) ? job.skills : [];
  const minHourlyRate = job.minHourlyRate || null;
  const maxHourlyRate = job.maxHourlyRate || null;
  const hourlyType = job.hourlyType || null;
  const hourlyWeeks = job.hourlyWeeks || null;
  const description = job.description || "";
  const shortDesc = description.length > 120 ? description.slice(0, 120) + "..." : description;
  const isTruncated = description.length > 120;

  const handleCardClick = () => {
    navigate(`/upwork/jobs/${job.jobId}`, { state: { job } });
  };

  const handleReadMoreClick = (e) => {
    e.stopPropagation();
    setShowFullDesc(true);
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-xl hover:scale-[1.025] border border-transparent transition-all duration-200 group min-h-[180px] flex flex-col"
      onClick={handleCardClick}>
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-800 flex-1 truncate">{job.title || "Job Title"}</h2>
          {tier && (
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass} ml-2`} title="Tier">
              {tier === 'Green' ? 'AI Recommended' :
                tier === 'Yellow' ? 'Recommended' :
                  tier === 'Red' ? 'Not Recommended' : tier}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-1">
          {jobType && (
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">
              {jobType}
            </span>
          )}
          {occupation && (
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.occupation}`} title="Occupation">
              {occupation}
            </span>
          )}
          {level && (
            <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300" title="Level">
              {level}
            </span>
          )}
          {contractorTier && (
            <span className="px-2 py-0.5 rounded text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-300" title="Contractor Tier">
              {contractorTier}
            </span>
          )}
        
          <span className={ `px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.hires}`} title="Hires">Hires:
          {job.buyerTotalJobsWithHires === null || job.buyerTotalJobsWithHires === undefined
            ? "No hires"
            : job.buyerTotalJobsWithHires < 10
              ? job.buyerTotalJobsWithHires
              :job.buyerTotalJobsWithHires }</span>
        <div className="text-xs text-gray-500 mb-1 flex gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.country}`} title="Country">{country}</span>
          </div>
          {companyIndustry && <span>{companyIndustry}</span>}
        </div>
        <div className={`text-gray-700 text-sm mb-2 ${!showFullDesc ? 'line-clamp-3' : ''} min-h-[40px]`}>
          <span className="font-bold">Description: </span>
          {showFullDesc ? description : shortDesc}
          {isTruncated && !showFullDesc && (
            <button
              className="text-blue-500 ml-1 text-xs underline hover:text-blue-700"
              onClick={handleReadMoreClick}
            >
              Read more
            </button>
          )}
        </div>
      </div>
      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-1">
        {skills.slice(0, 4).map(skill => (
          <span key={skill} className="bg-gray-100 text-xs px-2 py-1 rounded">{skill}</span>
        ))}
      </div>
      <div>
  <span className={ `bg-blue-100 text-blue-800 border-blue-300 ${badgeClass.projectLength}`} title="Project Length">Project Length:
  {(() => {
    const weeks = job.hourlyWeeks;
    if (weeks === null || weeks === undefined || weeks < 4) return "Less than 1 month";
    if (weeks >= 4 && weeks < 13) return "1 to 3 months";
    if (weeks >= 13 && weeks < 25) return "3 to 6 months";
    if (weeks >= 25) return "More than 6 months";
    return "-";
  })()}
</span>
</div>
      {/* Meta Section */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
        {minHourlyRate && <span>Min Rate: ${minHourlyRate}</span>}
        {maxHourlyRate && <span>Max Rate: ${maxHourlyRate}</span>}
        {hourlyType && <span>Type: {hourlyType}</span>}
        {hourlyWeeks && <span>Weeks: {hourlyWeeks}</span>}
      </div>
      {/* Company Section */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
        <span><span className="font-bold">Company:</span> {companyName}</span>
        <span><span className="font-bold">Size:</span> {companySize}</span>
      </div>
    </div>
  );
};

export default UpworkJobCard;