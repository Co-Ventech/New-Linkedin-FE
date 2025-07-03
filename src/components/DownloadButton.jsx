import React from "react";

const DownloadButton = ({ onClick }) => (
  <button
    className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
    onClick={onClick}
  >
    Download Excel
  </button>
);

export default DownloadButton; 