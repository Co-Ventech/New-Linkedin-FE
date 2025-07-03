import React from "react";

const JobDetailsModal = ({ job, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-2">{job?.title || "Job Title"}</h2>
        <p className="text-gray-600 mb-1">{job?.company || "Company Name"}</p>
        <p className="text-gray-500 text-sm mb-2">{job?.location || "Location"}</p>
        <div className="text-gray-700 text-sm">
          {job?.description || "Full job description goes here."}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal; 