import React from "react";

const tierColor = (tier) => {
  if (!tier) return "bg-gray-200 text-gray-700";
  if (tier.toLowerCase() === "yellow") return "bg-yellow-200 text-yellow-800";
  if (tier.toLowerCase() === "green") return "bg-green-200 text-green-800";
  if (tier.toLowerCase() === "red") return "bg-red-200 text-red-800";
  return "bg-gray-200 text-gray-700";
};

const JobCard = ({ job, onClick }) => {
  return (
    <div className="bg-white rounded shadow p-4 cursor-pointer hover:shadow-lg transition" onClick={onClick}>
      <div className="flex items-center gap-3 mb-2">
        {job["Company Logo"] && (
          <img src={job["Company Logo"]} alt={job["Company"]} className="w-10 h-10 rounded object-contain" />
        )}
        <div>
          <h2 className="text-lg font-semibold">{job["Job Title"] || "Job Title"}</h2>
          <p className="text-gray-600 text-sm">{job["Company"] || "Company"}</p>
        </div>
        {job["tier"] && (
          <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${tierColor(job["tier"])}`}>
            {job["tier"]}
          </span>
        )}
      </div>
      <div className="text-gray-500 text-xs mb-1">
        {job["Date Posted"] ? new Date(job["Date Posted"]).toLocaleDateString() : "Date Posted"}
      </div>
      <div className="text-gray-500 text-sm mb-1">
        {job["Locations"] || job["Cities"] || job["Countries"] || "Location"}
      </div>
      <div className="text-xs mb-1 flex flex-wrap gap-1">
        {job["Remote"] === "True" && <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Remote</span>}
        {job["Employment Type"] && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{job["Employment Type"]}</span>}
        {job["Seniority Level"] && <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{job["Seniority Level"]}</span>}
        {job["Source"] && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">{job["Source"]}</span>}
      </div>
      <div className="text-gray-700 text-sm line-clamp-3 mb-2">
        {job["Job Description"]?.slice(0, 120) || "Job description not available."}
      </div>
      <div className="text-xs text-gray-600 mb-1">
        <span className="font-semibold">Recruiter:</span> {job["Recruiter Name"] || "-"}
        {job["Recruiter Title"] && <span className="ml-1 text-gray-400">({job["Recruiter Title"]})</span>}
      </div>
      <div className="text-xs text-gray-600 mb-1">
        <span className="font-semibold">Company Size:</span> {job["Company Size"] || "-"}
      </div>
      {job["Company Followers"] && (
        <div className="text-xs text-gray-600 mb-1">
          <span className="font-semibold">Followers:</span> {job["Company Followers"]}
        </div>
      )}
      <div className="text-xs text-gray-600 mb-1">
        <span className="font-semibold">Industry:</span> {job["Industry"] || "-"}
      </div>
      <a
        href={job["Job URL"]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs mt-2 inline-block"
        onClick={e => e.stopPropagation()}
      >
        View Job
      </a>
    </div>
  );
};

export default JobCard; 