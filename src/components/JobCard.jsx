import React from "react";

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

const JobCard = ({ job, onClick }) => {
  const [showFullDesc, setShowFullDesc] = React.useState(false);
  const desc = job.descriptionText || '';
  const shortDesc = desc.length > 120 ? desc.slice(0, 120) : desc;
  const isTruncated = desc.length > 120;
  const tierColorClass = badgeClass.tier[job.tier] || badgeClass.tier.Default;
  return (
    <div
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-xl hover:scale-[1.025] hover:border-blue-400 border border-transparent transition-all duration-200 group min-h-[320px] flex flex-col"
      onClick={onClick}
    >
      {/* Job Section */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-800 flex-1 truncate">{job.title || 'Job Title'}</h2>
          {job.tier && (
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass} ml-2`} title="Tier">
              {job.tier === 'Green' ? 'AI Recommended' : job.tier === 'Yellow' ? 'Recommended' : job.tier === 'Red' ? 'Not Recommended' : job.tier}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-1">
          {job.employmentType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">{job.employmentType}</span>}
          {job.workplaceType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">{job.workplaceType}</span>}
          {job.applicants && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">{job.applicants} Applicants</span>}
          {job.views && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">{job.views} Views</span>}
        </div>
        <div className="text-xs text-gray-500 mb-1 flex gap-2">
          <span className="font-bold">{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Date Posted'}</span>
          {job.expireAt && <span className="font-bold">(Expires: {new Date(job.expireAt).toLocaleDateString()})</span>}
        </div>
        <div className={`text-gray-700 text-sm mb-2 ${!showFullDesc ? 'line-clamp-3' : ''} min-h-[40px]`}>
          <span className="font-bold">Description: </span>
          {showFullDesc ? desc : shortDesc}
          {isTruncated && !showFullDesc && (
            <button
              className="text-blue-500 ml-1 text-xs underline hover:text-blue-700"
              onClick={e => { e.stopPropagation(); setShowFullDesc(true); }}
            >
              Read more
            </button>
          )}
        </div>
      </div>
      {/* Company Section */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          {job.companyLogo && (
            <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
              <img src={job.companyLogo} alt={job.company} className="w-8 h-8 rounded object-contain border border-gray-200" />
            </a>
          )}
          <span className="font-bold text-xs text-gray-700">Company:</span>
          <span className="text-xs text-gray-800 font-semibold truncate">{job.company || 'Company'}</span>
          {job.companyWebsite && (
            <a href={job.companyWebsite} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">Website</a>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
          <span className="line-clamp-2 max-w-full"><span className="font-bold">Industry:</span> {Array.isArray(job.companyIndustries) ? job.companyIndustries.join(', ') : job.companyIndustries || '-'}</span>
          <span className="line-clamp-2 max-w-full"><span className="font-bold">Specialities:</span> {Array.isArray(job.companySpecialities) ? job.companySpecialities.join(', ') : job.companySpecialities || '-'}</span>
        </div>
      </div>
      {/* Meta Section */}
      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
        <span><span className="font-bold">Size:</span> {job.companyEmployeeCount || '-'}</span>
        <span><span className="font-bold">Followers:</span> {job.companyFollowerCount || '-'}</span>
        <span><span className="font-bold">Salary:</span> {job.salary || '-'}</span>
        {job.locations && Array.isArray(job.locations) && job.locations.length > 0 && (
          <span><span className="font-bold">Location:</span> {(() => {
            // If locations are objects with country
            if (typeof job.locations[0] === 'object' && job.locations[0] !== null && 'country' in job.locations[0]) {
              const countries = [...new Set(job.locations.map(loc => loc.country).filter(Boolean))];
              return countries.join(', ');
            }
            // If locations are strings
            const countries = [...new Set(job.locations.map(loc => {
              if (typeof loc === 'string') {
                const parts = loc.split(',');
                return parts[parts.length - 1].trim();
              }
              return '';
            }).filter(Boolean))];
            return countries.join(', ');
          })()}</span>
        )}
      </div>
      <div className="flex gap-2 mt-auto pt-2">
        <a
          href={job.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-xs"
          onClick={e => e.stopPropagation()}
        >
          View Job
        </a>
        {job.easyApplyUrl && (
          <a
            href={job.easyApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline text-xs"
            onClick={e => e.stopPropagation()}
          >
            Easy Apply
          </a>
        )}
      </div>
    </div>
  );
};

export default JobCard; 