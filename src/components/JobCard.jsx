import React from "react";

const JobCard = ({ job, onClick }) => {
  return (
    <div className="bg-white rounded shadow p-4 cursor-pointer hover:shadow-lg transition" onClick={onClick}>
      <div className="flex items-center gap-3 mb-2">
        {job.organization_logo && (
          <img src={job.organization_logo} alt={job.organization} className="w-10 h-10 rounded object-contain" />
        )}
        <div>
          <h2 className="text-lg font-semibold">{job?.title || "Job Title"}</h2>
          <p className="text-gray-600 text-sm">{job?.organization || "Organization"}</p>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-2">{job?.location || "Location"}</p>
      <p className="text-gray-700 text-sm line-clamp-2">{job?.description_text || "Short job description goes here."}</p>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs mt-2 inline-block"
        onClick={e => e.stopPropagation()}
      >
        View on LinkedIn
      </a>
    </div>
  );
};

export default JobCard; 