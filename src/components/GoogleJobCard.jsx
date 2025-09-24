
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const GoogleJobCard = ({ job, view = "grid" }) => {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     navigate(`/google-job-details/${job._id}`, { state: { job } }); // Navigate to details page
//   };

//   const title = job?.title || "Untitled";
//   const company = job?.company_name || "Not specified";
//   const location = job?.location || "Remote";
//   const extensions = job?.extensions || [];
//   const salary = extensions.find((ext) => /\$|usd|salary|hour|year|comp/i.test(ext));
//   const remote = extensions.find((ext) => /remote|work\s*from\s*home|hybrid/i.test(ext));
//   const posted = extensions.find((ext) => /hour|day|week|month|ago/i.test(ext));
//   const applyLinks = job?.apply_options || [];

//   const tags = [salary, remote, posted].filter(Boolean); // Collect tags for display

//   return (
//     <div
//       className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-200 ${
//         view === "list" ? "flex flex-row gap-4" : "flex flex-col"
//       }`}
//       onClick={handleCardClick}
//     >
//       {/* Job Title and Company */}
//       <div className="flex-1">
//         <h2 className="text-lg font-bold text-gray-900 leading-snug truncate" title={title}>
//           {title}
//         </h2>
//         <p className="text-sm text-gray-700 truncate" title={company}>
//           {company}
//         </p>
//         <p className="text-sm text-gray-600">{location}</p>

//         {/* Tags */}
//         {tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-2">
//             {tags.map((tag, index) => (
//               <span
//                 key={index}
//                 className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
//               >
//                 {tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Apply Links */}
//       <div className="flex flex-col items-end">
//         {applyLinks.map((link, index) => (
//           <a
//             key={index}
//             href={link.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-sm text-blue-600 hover:underline"
//             onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
//           >
//             {link.title || "Apply"}
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GoogleJobCard;


import React from "react";
import { useNavigate } from "react-router-dom";

const GoogleJobCard = ({ job, view = "grid" }) => {
  const navigate = useNavigate();
  // const cid = job._id || job.companyJobId || job.id || job.jobId;

  // const handleCardClick = () => {
  //   if (!job?._id) return;
  //   navigate(`/google-jobs/${encodeURIComponent(job._id)}`, { state: { job } });
  // };

  // helpers at top of component
  const toText = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.filter(Boolean).join(', ');
    if (typeof v === 'object') return v.name || v.title || v.label || '';
    return String(v);
  };

  const getCompanyName = (job) =>
    toText(job.company) || job.companyName || toText(job.employer) || 'Unknown';

  const getLocation = (job) => {
    // try common fields first
    const direct =
      toText(job.location) ||
      toText(job.city) ||
      toText(job.country) ||
      (Array.isArray(job.locations) ? job.locations.map(toText).filter(Boolean).join(', ') : '') ||
      toText(job.company?.locations?.[0]);
    return direct || 'Remote';
  };

  const getTitle = (job) =>
    toText(job.title) || toText(job.job_title) || 'Untitled';

  const getSalaryTag = (job) => {
    // support extensions or pay fields
    const ext = Array.isArray(job.extensions) ? job.extensions.find((e) => typeof e === 'string' && /salary|compensation|pay/i.test(e)) : '';
    return ext || toText(job.compensation) || '';
  };

  const getPostedTag = (job) => {
    const ext = Array.isArray(job.extensions) ? job.extensions.find((e) => typeof e === 'string' && /posted/i.test(e)) : '';
    return ext || (job.ts_publish ? new Date(job.ts_publish).toDateString() : '');
  };

  const getSummary = (job) => {
    const highlights = Array.isArray(job.job_highlights) ? job.job_highlights : [];
    // prefer "Qualifications" or "Job Summary"
    const byTitle = (t) => highlights.find(h => (h.title || '').toLowerCase().includes(t));
    const qual = byTitle('qualification') || byTitle('summary');
    if (qual?.items?.length) return toText(qual.items[0]);
    // fallback short description
    return (toText(job.description) || '').slice(0, 200);
  };

  const firstApply = (job) => {
    const opts = Array.isArray(job.apply_options) ? job.apply_options : [];
    const link = opts.find((o) => o?.link || o?.url) || {};
    return link.link || link.url || job.url || job.share_link || '';
  };

  
  // const handleCardClick = () => {
  //   navigate(`/google-job-details/${cid}`, { state: { job } }); // Navigate to details page
  // };

  // inside the card component
const cid = job?._id || job?.companyJobId || job?.id || job?.jobId;
const handleClick = () => {
  if (!cid) return;
    navigate(`/google-job-details/${encodeURIComponent(cid)}`);
};

  const title = job?.title || "Job Title";
  const company = job?.company_name || job?.company || "Company";
  const location = job?.location && String(job.location).trim() !== "" ? job.location : "Remote";
  const extensions = Array.isArray(job?.extensions) ? job.extensions : [];
  const salary = extensions.find((ext) => /\$|usd|salary|hour|year|comp/i.test(ext));
  const remote = extensions.find((ext) => /remote|work\s*from\s*home|hybrid/i.test(ext));
  const posted = extensions.find((ext) => /hour|day|week|month|ago/i.test(ext));

  const tags = [salary, remote, posted].filter(Boolean);

  const highlights = Array.isArray(job?.job_highlights) ? job.job_highlights : [];
  const summary = (() => {
    const sum = highlights.find(h => /summary/i.test(h?.title || ""))?.items;
    if (Array.isArray(sum) && sum.length > 0) return sum[0];
    const raw = job?.description_preview || "";
    if (!raw) return "";
    return raw.split(/\. |\n/)[0] || raw;
  })();

  const cardBase = "bg-white rounded-lg shadow cursor-pointer hover:shadow-xl hover:scale-[1.025] hover:border-blue-400 border border-transparent transition-all duration-200 group min-h-[120px]";
  const gridLayout = "flex flex-col";
  const listLayout = "flex flex-row items-stretch min-h-[120px]";

  return (
    <div
      className={`${cardBase} ${view === "list" ? listLayout : gridLayout} p-2`}
      onClick={handleClick}
    >
      <div className={view === "list" ? "flex-1" : "flex-1 flex flex-col"}>
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-800 flex-1 truncate">{title}</h2>
            {tags[0] && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                {tags[0]}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-1">
            {tags.slice(1).map((t, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600">{getCompanyName(job)}</div>
          <div className="text-xs text-gray-500">{getLocation(job)}</div>
          {getSalaryTag(job) && <span className="chip">{getSalaryTag(job)}</span>}
          {getPostedTag(job) && <span className="chip">{getPostedTag(job)}</span>}
          <p className="text-sm text-gray-700">{getSummary(job)}</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleJobCard;