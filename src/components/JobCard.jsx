// // import React from "react";

// // const badgeClass = {
// //   tier: {
// //     Yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400',
// //     Green: 'bg-green-200 text-green-800 border-green-400',
// //     Red: 'bg-red-200 text-red-800 border-red-400',
// //     Default: 'bg-gray-200 text-gray-700 border-gray-300',
// //   },
// //   jobType: 'bg-blue-100 text-blue-800 border-blue-300',
// //   workplace: 'bg-indigo-100 text-indigo-800 border-indigo-300',
// //   applicants: 'bg-green-100 text-green-800 border-green-300',
// //   views: 'bg-orange-100 text-orange-800 border-orange-300',
// // };

// // const JobCard = ({ job, onClick }) => {
// //   const [showFullDesc, setShowFullDesc] = React.useState(false);
// //   const desc = job.descriptionText || '';
// //   const shortDesc = desc.length > 120 ? desc.slice(0, 120) : desc;
// //   const isTruncated = desc.length > 120;
// //   const tierColorClass = badgeClass.tier[job.tier] || badgeClass.tier.Default;
// //   return (
// //     <div
// //       className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-xl hover:scale-[1.025] hover:border-blue-400 border border-transparent transition-all duration-200 group min-h-[320px] flex flex-col"
// //       onClick={onClick}
// //     >
// //       {/* Job Section */}
// //       <div className="mb-2">
// //         <div className="flex items-center gap-2 mb-1">
// //           <h2 className="text-lg font-bold text-gray-800 flex-1 truncate">{job.title || 'Job Title'}</h2>
// //           {job.tier && (
// //             <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass} ml-2`} title="Tier">
// //               {job.tier === 'Green' ? 'AI Recommended' : job.tier === 'Yellow' ? 'Recommended' : job.tier === 'Red' ? 'Not Recommended' : job.tier}
// //             </span>
// //           )}
// //         </div>
// //         <div className="flex flex-wrap gap-2 mb-1">
// //           {job.employmentType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">{job.employmentType}</span>}
// //           {job.workplaceType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">{job.workplaceType}</span>}
// //           {job.applicants && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">{job.applicants} Applicants</span>}
// //           {job.views && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">{job.views} Views</span>}
// //         </div>
// //         <div className="text-xs text-gray-500 mb-1 flex gap-2">
// //           <span className="font-bold">{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Date Posted'}</span>
// //           {job.expireAt && <span className="font-bold">(Expires: {new Date(job.expireAt).toLocaleDateString()})</span>}
// //         </div>
// //         <div className={`text-gray-700 text-sm mb-2 ${!showFullDesc ? 'line-clamp-3' : ''} min-h-[40px]`}>
// //           <span className="font-bold">Description: </span>
// //           {showFullDesc ? desc : shortDesc}
// //           {isTruncated && !showFullDesc && (
// //             <button
// //               className="text-blue-500 ml-1 text-xs underline hover:text-blue-700"
// //               onClick={e => { e.stopPropagation(); setShowFullDesc(true); }}
// //             >
// //               Read more
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //       {/* Company Section */}
// //       <div className="mb-2">
// //         <div className="flex items-center gap-2 mb-1">
// //           {job.companyLogo && (
// //             <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
// //               <img src={job.companyLogo} alt={job.company} className="w-8 h-8 rounded object-contain border border-gray-200" />
// //             </a>
// //           )}
// //           <span className="font-bold text-xs text-gray-700">Company:</span>
// //           <span className="text-xs text-gray-800 font-semibold truncate">{job.company || 'Company'}</span>
// //           {job.companyWebsite && (
// //             <a href={job.companyWebsite} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">Website</a>
// //           )}
// //         </div>
// //         <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
// //           <span className="line-clamp-2 max-w-full"><span className="font-bold">Industry:</span> {Array.isArray(job.companyIndustries) ? job.companyIndustries.join(', ') : job.companyIndustries || '-'}</span>
// //           <span className="line-clamp-2 max-w-full"><span className="font-bold">Specialities:</span> {Array.isArray(job.companySpecialities) ? job.companySpecialities.join(', ') : job.companySpecialities || '-'}</span>
// //         </div>
// //       </div>
// //       {/* Meta Section */}
// //       <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
// //         <span><span className="font-bold">Size:</span> {job.companyEmployeeCount || '-'}</span>
// //         <span><span className="font-bold">Followers:</span> {job.companyFollowerCount || '-'}</span>
// //         <span><span className="font-bold">Salary:</span> {job.salary || '-'}</span>
// //         {job.locations && Array.isArray(job.locations) && job.locations.length > 0 && (
// //           <span><span className="font-bold">Location:</span> {(() => {
// //             // If locations are objects with country
// //             if (typeof job.locations[0] === 'object' && job.locations[0] !== null && 'country' in job.locations[0]) {
// //               const countries = [...new Set(job.locations.map(loc => loc.country).filter(Boolean))];
// //               return countries.join(', ');
// //             }
// //             // If locations are strings
// //             const countries = [...new Set(job.locations.map(loc => {
// //               if (typeof loc === 'string') {
// //                 const parts = loc.split(',');
// //                 return parts[parts.length - 1].trim();
// //               }
// //               return '';
// //             }).filter(Boolean))];
// //             return countries.join(', ');
// //           })()}</span>
// //         )}
// //       </div>
// //       <div className="flex gap-2 mt-auto pt-2">
// //         <a
// //           href={job.linkedinUrl}
// //           target="_blank"
// //           rel="noopener noreferrer"
// //           className="text-blue-600 hover:underline text-xs"
// //           onClick={e => e.stopPropagation()}
// //         >
// //           View Job
// //         </a>
// //         {job.easyApplyUrl && (
// //           <a
// //             href={job.easyApplyUrl}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="text-green-600 hover:underline text-xs"
// //             onClick={e => e.stopPropagation()}
// //           >
// //             Easy Apply
// //           </a>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default JobCard; 

// // import React from "react";

// // const badgeClass = {
// //   tier: {
// //     Yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400',
// //     Green: 'bg-green-200 text-green-800 border-green-400',
// //     Red: 'bg-red-200 text-red-800 border-red-400',
// //     Default: 'bg-gray-200 text-gray-700 border-gray-300',
// //   },
// //   jobType: 'bg-blue-100 text-blue-800 border-blue-300',
// //   workplace: 'bg-indigo-100 text-indigo-800 border-indigo-300',
// //   applicants: 'bg-green-100 text-green-800 border-green-300',
// //   views: 'bg-orange-100 text-orange-800 border-orange-300',
// // };

// // const JobCard = ({ job, onClick }) => {
// //   const [showFullDesc, setShowFullDesc] = React.useState(false);
// //   const desc = job.descriptionText || '';
// //   const shortDesc = desc.length > 120 ? desc.slice(0, 120) : desc;
// //   const isTruncated = desc.length > 120;
// //   const tierColorClass = badgeClass.tier[job.tier] || badgeClass.tier.Default;

// //   const companyName = typeof job.company === 'object' ? job.company.name : job.company;

// //   return (
// //     <div
// //       className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-xl hover:scale-[1.025] hover:border-blue-400 border border-transparent transition-all duration-200 group min-h-[320px] flex flex-col"
// //       onClick={onClick}
// //     >
// //       {/* Job Section */}
// //       <div className="mb-2">
// //         <div className="flex items-center gap-2 mb-1">
// //           <h2 className="text-lg font-bold text-gray-800 flex-1 truncate">
// //             {job.title || 'Job Title'}
// //           </h2>
// //           {job.tier && (
// //             <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass} ml-2`} title="Tier">
// //               {job.tier === 'Green' ? 'AI Recommended' :
// //                job.tier === 'Yellow' ? 'Recommended' :
// //                job.tier === 'Red' ? 'Not Recommended' : job.tier}
// //             </span>
// //           )}
// //         </div>
// //         <div className="flex flex-wrap gap-2 mb-1">
// //           {job.employmentType && (
// //             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">
// //               {job.employmentType}
// //             </span>
// //           )}
// //           {job.workplaceType && (
// //             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">
// //               {job.workplaceType}
// //             </span>
// //           )}
// //           {job.applicants && (
// //             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">
// //               {job.applicants} Applicants
// //             </span>
// //           )}
// //           {job.views && (
// //             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">
// //               {job.views} Views
// //             </span>
// //           )}
// //         </div>
// //         <div className="text-xs text-gray-500 mb-1 flex gap-2">
// //           <span className="font-bold">{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'Date Posted'}</span>
// //           {job.expireAt && (
// //             <span className="font-bold">(Expires: {new Date(job.expireAt).toLocaleDateString()})</span>
// //           )}
// //         </div>
// //         <div className={`text-gray-700 text-sm mb-2 ${!showFullDesc ? 'line-clamp-3' : ''} min-h-[40px]`}>
// //           <span className="font-bold">Description: </span>
// //           {showFullDesc ? desc : shortDesc}
// //           {isTruncated && !showFullDesc && (
// //             <button
// //               className="text-blue-500 ml-1 text-xs underline hover:text-blue-700"
// //               onClick={(e) => { e.stopPropagation(); setShowFullDesc(true); }}
// //             >
// //               Read more
// //             </button>
// //           )}
// //         </div>
// //         {job["tier"] && (
// //           <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${tierColor(job["tier"])}`}>
// //             {job["tier"]}
// //           </span>
// //         )}
// //       </div>
// //       <div className="text-gray-500 text-xs mb-1">
// //         {job["Date Posted"] ? new Date(job["Date Posted"]).toLocaleDateString() : "Date Posted"}
// //       </div>
// //       <div className="text-gray-500 text-sm mb-1">
// //         {job["Locations"] || job["Cities"] || job["Countries"] || "Location"}
// //       </div>
// //       <div className="text-xs mb-1 flex flex-wrap gap-1">
// //         {job["Remote"] === "True" && <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Remote</span>}
// //         {job["Employment Type"] && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{job["Employment Type"]}</span>}
// //         {job["Seniority Level"] && <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{job["Seniority Level"]}</span>}
// //         {job["Source"] && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">{job["Source"]}</span>}
// //       </div>
// //       <div className="text-gray-700 text-sm line-clamp-3 mb-2">
// //         {job["Job Description"]?.slice(0, 120) || "Job description not available."}
// //       </div>
// //       <div className="text-xs text-gray-600 mb-1">
// //         <span className="font-semibold">Recruiter:</span> {job["Recruiter Name"] || "-"}
// //         {job["Recruiter Title"] && <span className="ml-1 text-gray-400">({job["Recruiter Title"]})</span>}
// //       </div>
// //       <div className="text-xs text-gray-600 mb-1">
// //         <span className="font-semibold">Company Size:</span> {job["Company Size"] || "-"}
// //       </div>
// //       {job["Company Followers"] && (
// //         <div className="text-xs text-gray-600 mb-1">
// //           <span className="font-semibold">Followers:</span> {job["Company Followers"]}
// //         </div>
// //       )}
// //       <div className="text-xs text-gray-600 mb-1">
// //         <span className="font-semibold">Industry:</span> {job["Industry"] || "-"}
// //       </div>

// //       {/* Company Section */}
// //       <div className="mb-2">
// //         <div className="flex items-center gap-2 mb-1">
// //           {job.companyLogo && (
// //             <a href={job.companyUrl || "#"} target="_blank" rel="noopener noreferrer">
// //               <img
// //                 src={job.companyLogo}
// //                 alt={companyName || "Company"}
// //                 className="w-8 h-8 rounded object-contain border border-gray-200"
// //               />
// //             </a>
// //           )}
// //           <span className="font-bold text-xs text-gray-700">Company:</span>
// //           <span className="text-xs text-gray-800 font-semibold truncate">{companyName || 'Company'}</span>
// //           {job.companyWebsite && (
// //             <a href={job.companyWebsite} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">Website</a>
// //           )}
// //         </div>
// //         <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
// //           <span className="line-clamp-2 max-w-full">
// //             <span className="font-bold">Industry:</span> {Array.isArray(job.companyIndustries) ? job.companyIndustries.join(', ') : job.companyIndustries || '-'}
// //           </span>
// //           <span className="line-clamp-2 max-w-full">
// //             <span className="font-bold">Specialities:</span> {Array.isArray(job.companySpecialities) ? job.companySpecialities.join(', ') : job.companySpecialities || '-'}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Meta Section */}
// //       <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
// //         <span><span className="font-bold">Size:</span> {job.companyEmployeeCount || '-'}</span>
// //         <span><span className="font-bold">Followers:</span> {job.companyFollowerCount || '-'}</span>
// //         <span><span className="font-bold">Salary:</span> {job.salary || '-'}</span>
// //         {job.locations && Array.isArray(job.locations) && job.locations.length > 0 && (
// //           <span><span className="font-bold">Location:</span> {(() => {
// //             if (typeof job.locations[0] === 'object' && job.locations[0] !== null && 'country' in job.locations[0]) {
// //               const countries = [...new Set(job.locations.map(loc => loc.country).filter(Boolean))];
// //               return countries.join(', ');
// //             }
// //             const countries = [...new Set(job.locations.map(loc => {
// //               if (typeof loc === 'string') {
// //                 const parts = loc.split(',');
// //                 return parts[parts.length - 1].trim();
// //               }
// //               return '';
// //             }).filter(Boolean))];
// //             return countries.join(', ');
// //           })()}</span>
// //         )}
// //       </div>

// //       {/* Footer */}
// //       <div className="flex gap-2 mt-auto pt-2">
// //         {job.linkedinUrl && (
// //           <a
// //             href={job.linkedinUrl}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="text-blue-600 hover:underline text-xs"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             View Job
// //           </a>
// //         )}
// //         {job.easyApplyUrl && (
// //           <a
// //             href={job.easyApplyUrl}
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="text-green-600 hover:underline text-xs"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             Easy Apply
// //           </a>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default JobCard;


// import React from "react";

// const badgeClass = {
//   tier: {
//     Yellow: 'bg-yellow-200 text-yellow-800 border-yellow-400',
//     Green: 'bg-green-200 text-green-800 border-green-400',
//     Red: 'bg-red-200 text-red-800 border-red-400',
//     Default: 'bg-gray-200 text-gray-700 border-gray-300',
//   },
//   jobType: 'bg-blue-100 text-blue-800 border-blue-300',
//   workplace: 'bg-indigo-100 text-indigo-800 border-indigo-300',
//   applicants: 'bg-green-100 text-green-800 border-green-300',
//   views: 'bg-orange-100 text-orange-800 border-orange-300',
// };

// const JobCard = ({ job, onClick }) => {
//   const [showFullDesc, setShowFullDesc] = React.useState(false);

//   const desc = job.descriptionText || job["Job Description"] || '';
//   const shortDesc = desc.length > 120 ? desc.slice(0, 120) : desc;
//   const isTruncated = desc.length > 120;
//   const tierColorClass = badgeClass.tier[job.tier] || badgeClass.tier.Default;

//   const companyName = typeof job.company === 'object' ? job.company.name : job.company;

//   return (
//     <div
//       className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-xl hover:scale-[1.025] hover:border-blue-400 border border-transparent transition-all duration-200 group min-h-[320px] flex flex-col"
//       onClick={onClick}
//     >
//       {/* Header */}
//       <div className="mb-2">
//         <div className="flex items-center gap-2 mb-1">
//           <h2 className="text-lg font-bold text-gray-800 flex-1 truncate">{job.title || 'Job Title'}</h2>
//           {job.tier && (
//             <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass} ml-2`} title="Tier">
//               {job.tier === 'Green' ? 'AI Recommended' :
//                job.tier === 'Yellow' ? 'Recommended' :
//                job.tier === 'Red' ? 'Not Recommended' : job.tier}
//             </span>
//           )}
//         </div>

//         {/* Badges */}
//         <div className="flex flex-wrap gap-2 mb-1">
//           {job.employmentType && (
//             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">
//               {job.employmentType}
//             </span>
//           )}
//           {job.workplaceType && (
//             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">
//               {job.workplaceType}
//             </span>
//           )}
//           {job.applicants && (
//             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">
//               {job.applicants} Applicants
//             </span>
//           )}
//           {job.views && (
//             <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">
//               {job.views} Views
//             </span>
//           )}
//         </div>

//         {/* Dates */}
//         <div className="text-xs text-gray-500 mb-1 flex gap-2">
//           <span className="font-bold">
//             {job.postedDate || job["Date Posted"] ? new Date(job.postedDate || job["Date Posted"]).toLocaleDateString() : 'Date Posted'}
//           </span>
//           {job.expireAt && (
//             <span className="font-bold">(Expires: {new Date(job.expireAt).toLocaleDateString()})</span>
//           )}
//         </div>

//         {/* Description */}
//         <div className={`text-gray-700 text-sm mb-2 ${!showFullDesc ? 'line-clamp-3' : ''} min-h-[40px]`}>
//           <span className="font-bold">Description: </span>
//           {showFullDesc ? desc : shortDesc}
//           {isTruncated && !showFullDesc && (
//             <button
//               className="text-blue-500 ml-1 text-xs underline hover:text-blue-700"
//               onClick={(e) => { e.stopPropagation(); setShowFullDesc(true); }}
//             >
//               Read more
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Additional Tags */}
//       <div className="text-gray-500 text-sm mb-1">
//         {job["Locations"] || job["Cities"] || job["Countries"] || "Location"}
//       </div>
//       <div className="text-xs mb-1 flex flex-wrap gap-1">
//         {job["Remote"] === "True" && <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Remote</span>}
//         {job["Employment Type"] && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{job["Employment Type"]}</span>}
//         {job["Seniority Level"] && <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{job["Seniority Level"]}</span>}
//         {job["Source"] && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">{job["Source"]}</span>}
//       </div>

//       {/* Recruiter Info */}
//       <div className="text-xs text-gray-600 mb-1">
//         <span className="font-semibold">Recruiter:</span> {job["Recruiter Name"] || "-"}
//         {job["Recruiter Title"] && <span className="ml-1 text-gray-400">({job["Recruiter Title"]})</span>}
//       </div>

//       {/* Company Info */}
//       <div className="text-xs text-gray-600 mb-1">
//         <span className="font-semibold">Company Size:</span> {job["Company Size"] || "-"}
//       </div>
//       {job["Company Followers"] && (
//         <div className="text-xs text-gray-600 mb-1">
//           <span className="font-semibold">Followers:</span> {job["Company Followers"]}
//         </div>
//       )}
//       <div className="text-xs text-gray-600 mb-1">
//         <span className="font-semibold">Industry:</span> {job["Industry"] || "-"}
//       </div>

//       {/* Company Section */}
//       <div className="mb-2">
//         <div className="flex items-center gap-2 mb-1">
//           {job.companyLogo && (
//             <a href={job.companyUrl || "#"} target="_blank" rel="noopener noreferrer">
//               <img
//                 src={job.companyLogo}
//                 alt={companyName || "Company"}
//                 className="w-8 h-8 rounded object-contain border border-gray-200"
//               />
//             </a>
//           )}
//           <span className="font-bold text-xs text-gray-700">Company:</span>
//           <span className="text-xs text-gray-800 font-semibold truncate">{companyName || 'Company'}</span>
//           {job.companyWebsite && (
//             <a href={job.companyWebsite} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">Website</a>
//           )}
//         </div>

//         <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
//           <span><span className="font-bold">Industry:</span> {Array.isArray(job.companyIndustries) ? job.companyIndustries.join(', ') : job.companyIndustries || '-'}</span>
//           <span><span className="font-bold">Specialities:</span> {Array.isArray(job.companySpecialities) ? job.companySpecialities.join(', ') : job.companySpecialities || '-'}</span>
//         </div>
//       </div>

//       {/* Meta Section */}
//       <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
//         <span><span className="font-bold">Size:</span> {job.companyEmployeeCount || '-'}</span>
//         <span><span className="font-bold">Followers:</span> {job.companyFollowerCount || '-'}</span>
//         <span><span className="font-bold">Salary:</span> {job.salary || '-'}</span>
//         {job.locations && Array.isArray(job.locations) && job.locations.length > 0 && (
//           <span><span className="font-bold">Location:</span> {(() => {
//             if (typeof job.locations[0] === 'object' && job.locations[0]?.country) {
//               return [...new Set(job.locations.map(loc => loc.country))].join(', ');
//             }
//             return [...new Set(job.locations.map(loc => typeof loc === 'string' ? loc.split(',').pop().trim() : ''))].join(', ');
//           })()}</span>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="flex gap-2 mt-auto pt-2">
//         {job.linkedinUrl && (
//           <a
//             href={job.linkedinUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline text-xs"
//             onClick={(e) => e.stopPropagation()}
//           >
//             View Job
//           </a>
//         )}
//         {job.easyApplyUrl && (
//           <a
//             href={job.easyApplyUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-green-600 hover:underline text-xs"
//             onClick={(e) => e.stopPropagation()}
//           >
//             Easy Apply
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

// export default JobCard;


import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit3, Check, X, ChevronDown } from 'lucide-react';
import { updateJobStatusNewThunk, fetchUpworkJobsByDateThunk } from "../slices/jobsSlice";
import { fetchJobsByDateThunk } from "../slices/jobsSlice";
import { selectStatusOptions } from '../slices/userSlice';




const DEFAULT_STATUS_OPTIONS = [
  'not_engaged', 'applied', 'engaged', 'interview', 'offer', 'rejected', 'onboard'
];

// const statusOptions = useSelector(selectStatusOptions);

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

const JobCard = ({ job, onClick, view = "grid", statusOptions=DEFAULT_STATUS_OPTIONS }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showFullDesc, setShowFullDesc] = React.useState(false);

  const [statusOpen, setStatusOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState(job?.currentStatus || 'not_engaged');
  // const STATUS_OPTIONS = useSelector(selectStatusOptions);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");


  const [displayStatus, setDisplayStatus] = React.useState(job?.currentStatus || 'not_engaged');
  const STATUS_OPTIONS = useSelector(selectStatusOptions);
  const statusLabels = {
    not_engaged: 'Not Engaged',
    applied: 'Applied',
    engaged: 'Engaged',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    onboard: 'Onboard',
  };

  const statusPill = {
    not_engaged: 'bg-gray-100 text-gray-800 border border-gray-200',
    applied: 'bg-blue-100 text-blue-800 border border-blue-200',
    engaged: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    interview: 'bg-purple-100 text-purple-800 border border-purple-200',
    offer: 'bg-green-100 text-green-800 border border-green-200',
    rejected: 'bg-red-100 text-red-800 border border-red-200',
    onboard: 'bg-slate-100 text-slate-800 border border-slate-200',
  };

  useEffect(() => {
    setDisplayStatus(job?.currentStatus || 'not_engaged');
    setSelectedStatus(job?.currentStatus || 'not_engaged');
  }, [job?.currentStatus]);

  const openStatusMenu = (e) => {
    e.stopPropagation();
    setStatusOpen(v => !v);
    setError("");
  };

  const handleStatusChange = (e) => {
    e.stopPropagation();
    setSelectedStatus(e.target.value);
  };

  const handleSaveStatus = async (e) => {
    e.stopPropagation();
    if (!job?._id) {
      setError("Missing job _id");
      return;
    }
    if (!selectedStatus) return;
    try {
      setSaving(true);
      // Optimistic local indicator (optional)
      const payload = { jobId: job._id, status: selectedStatus };
      await dispatch(updateJobStatusNewThunk(payload)).unwrap();
      setStatusOpen(false);
      setError("");
      setDisplayStatus(selectedStatus);
      // Background refresh to keep lists/kanban in sync
      dispatch(fetchJobsByDateThunk({}));
    } catch (err) {
      console.error('Inline status update failed:', err);
      setError(err?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleViewJob = (e) => {
    e.stopPropagation();
    const cid = job?._id || job?.companyJobId;
    if (!cid || String(cid).length !== 24) return;
    // Navigate to LinkedIn-specific route
    navigate(`/linkedin-jobs/${cid}`, { state: { job } });
  };

// And handleReadMoreClick around line 634:
const handleReadMoreClick = (e) => {
  e.stopPropagation();
  const cid = job?._id || job?.companyJobId;
  if (!cid || String(cid).length !== 24) return;
  // Navigate to LinkedIn-specific route
  navigate(`/linkedin-jobs/${cid}`, { state: { job } });
};
  // Safe data extraction with try-catch
  const extractJobData = () => {
    try {
      // Defensive: support both flat and nested company fields
      const companyObj = typeof job?.company === 'object' && job.company !== null ? job.company : {};

      // Safe company name extraction
      const companyName = (() => {
        try {
          return companyObj.name ||
            (typeof job?.company === 'string' ? job.company : '') ||
            '-';
        } catch (err) {
          console.warn('Error extracting company name:', err);
          return '-';
        }
      })();

      const logo =
        companyObj.logo ||
        job.companyLogo ||
        job.logo ||
        companyObj.companyLogo ||
        "";

      // Safe array handling for industries
      const companyIndustries = (() => {
        try {
          return Array.isArray(companyObj.industries) ? companyObj.industries :
            Array.isArray(job?.companyIndustries) ? job.companyIndustries :
              [];
        } catch (err) {
          console.warn('Error extracting company industries:', err);
          return [];
        }
      })();

      // Safe array handling for specialities
      const companySpecialities = (() => {
        try {
          return Array.isArray(companyObj.specialities) ? companyObj.specialities :
            Array.isArray(job?.companySpecialities) ? job.companySpecialities :
              [];
        } catch (err) {
          console.warn('Error extracting company specialities:', err);
          return [];
        }
      })();

      // Safe location string extraction
      const locationString = (() => {
        try {
          if (Array.isArray(job?.locations) && job.locations.length > 0) {
            if (typeof job.locations[0] === 'object' && job.locations[0]?.country) {
              return [...new Set(job.locations.map(loc => loc?.country).filter(Boolean))].join(', ');
            } else {
              return [...new Set(job.locations.map(loc =>
                typeof loc === 'string' ? loc.split(',').pop()?.trim() : ''
              ).filter(Boolean))].join(', ');
            }
          } else if (typeof job?.locations === 'string') {
            return job.locations;
          }
          return '-';
        } catch (err) {
          console.warn('Error extracting location string:', err);
          return '-';
        }
      })();

      // Safe date formatting
      const formatDate = (dateValue) => {
        try {
          if (!dateValue) return null;
          const date = new Date(dateValue);
          return isNaN(date.getTime()) ? null : date.toLocaleDateString();
        } catch (err) {
          console.warn('Error formatting date:', err);
          return null;
        }
      };

      return {
        companyName,
        companyLogo: companyObj.logo || job?.companyLogo || null,
        companyUrl: companyObj.linkedinUrl || job?.companyUrl || '#',
        companyWebsite: companyObj.website || job?.companyWebsite || null,
        companyIndustries,
        companySpecialities,
        companyEmployeeCount: String(companyObj.employeeCount || job?.companyEmployeeCount || '-'),
        companyFollowerCount: String(companyObj.followerCount || job?.companyFollowerCount || '-'),
        locationString,
        postedDate: formatDate(job?.postedDate || job?.["Date Posted"]),
        expireDate: formatDate(job?.expireAt),
        description: job?.descriptionText || job?.["Job Description"] || '',
        title: job?.title || 'Job Title',
        tier: job?.tier || null,
        employmentType: job?.employmentType || null,
        workplaceType: job?.workplaceType || null,
        applicants: job?.applicants || null,
        views: job?.views || null,
        salary: job?.salary || null,
        linkedinUrl: job?.linkedinUrl || null,
        easyApplyUrl: job?.easyApplyUrl || null
      };
    } catch (err) {
      console.error('Error extracting job data:', err);
      setError('Failed to load job data');
      return null;
    }
  };

  const jobData = extractJobData();

  // Handle click events safely

  const handleCardClick = () => {
    const cid = job?._id || job?.companyJobId;
    if (!cid || String(cid).length !== 24) {
      console.warn('Missing company job _id; cannot open details.', job);
      return;
    }
    // Navigate to LinkedIn-specific route
    navigate(`/linkedin-jobs/${cid}`, { state: { job } });
  };

    // try {
    //   if (onClick && typeof onClick === "function") {
    //     onClick();
    //   }
    // } catch (err) {
    //   console.error("Error handling card click:", err);
    // }
  // };


  // const handleReadMoreClick = (e) => {
  //   try {
  //     e.stopPropagation();
  //     setShowFullDesc(true);
  //   } catch (err) {
  //     console.error('Error handling read more click:', err);
  //   }
  // };

  const handleLinkClick = (e) => {
    try {
      e.stopPropagation();
    } catch (err) {
      console.error('Error handling link click:', err);
    }
  };


  // Safe description processing
  const processDescription = () => {
    try {
      const desc = jobData.description;
      const shortDesc = desc.length > 120 ? desc.slice(0, 120) : desc;
      const isTruncated = desc.length > 120;
      return { desc, shortDesc, isTruncated };
    } catch (err) {
      console.warn('Error processing description:', err);
      return { desc: '', shortDesc: '', isTruncated: false };
    }
  };

  const { desc, shortDesc, isTruncated } = processDescription();
  const tierColorClass = badgeClass.tier[jobData.tier] || badgeClass.tier.Default;

  // Layout classes
  const cardBase = "bg-white rounded-lg shadow cursor-pointer hover:shadow-xl hover:scale-[1.025] hover:border-blue-400 border border-transparent transition-all duration-200 group min-h-[120px]";
  const gridLayout = "flex flex-col";
  const listLayout = "flex flex-row items-stretch min-h-[120px]";


  return (

    <div
      className={`${cardBase} ${view === "list" ? listLayout : gridLayout} p-2`}
      onClick={handleCardClick}
    >
      {/* Company Logo (left in list, top in grid) */}
      {jobData.companyLogo && (
        <a
          href={jobData.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className={view === "list" ? "flex-shrink-0 self-start mr-3" : "self-start mb-2"}
        >
          <img
            src={jobData.companyLogo}
            alt={jobData.companyName || "Company"}
            className="w-12 h-12 object-contain"
            onError={e => { try { e.target.style.display = 'none'; } catch { } }}
          />
        </a>
      )}
      {/* Main Content */}
      <div className={view === "list" ? "flex-1" : "flex-1 flex flex-col"}>
        {/* Header */}
        <div className="mb-2">
          <div className={view === "list" ? "flex items-center gap-2 mb-1" : "flex items-center gap-2 mb-1"}>
            {/* <h2 className="text-lg font-bold text-gray-800 flex-1">{jobData.title}</h2> */}
            <h2 className="text-lg font-bold text-gray-800 flex-1 truncate">{jobData.title || "Job Title"}</h2>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${statusPill[displayStatus] || statusPill.not_engaged}`}
              title="Current status"
            >
              {statusLabels[displayStatus] || displayStatus}
            </span>
            <button
              type="button"
              onClick={openStatusMenu}
              className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
              title="Change status"
            >
              <Edit3 className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {jobData.tier && (
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${tierColorClass} ml-2`} title="Tier">
                {jobData.tier === 'Green' ? 'AI Recommended' :
                  jobData.tier === 'Yellow' ? 'AI Not Recommended' :
                    jobData.tier === 'Red' ? 'Not Eligible' : jobData.tier}
              </span>
            )}
          </div>
          {/* Status dropdown panel */}
          {statusOpen && (
            <div
              className="mb-2 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <label className="text-xs text-gray-600">Status:</label>
              <select
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={saving}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 disabled:opacity-60"
              >
                <Check className="w-4 h-4" /> Save
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setStatusOpen(false); setSelectedStatus(job?.currentStatus || 'not_engaged'); setError(""); }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 text-gray-600 text-xs hover:bg-gray-100"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              {error && <span className="text-xs text-red-600 ml-2">{error}</span>}
            </div>
          )}
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-1">
            {jobData.employmentType && (
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">
                {jobData.employmentType}
              </span>
            )}
            {jobData.workplaceType && (
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">
                {jobData.workplaceType}
              </span>
            )}
            {jobData.applicants && (
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">
                {jobData.applicants} Applicants
              </span>
            )}
            {jobData.views && (
              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">
                {jobData.views} Views
              </span>
            )}
          </div>
          {/* Dates */}
          <div className="text-xs text-gray-500 mb-1 flex gap-2">
            <span className="font-bold">
              {jobData.postedDate || 'Date Posted'}
            </span>
            {jobData.expireDate && (
              <span className="font-bold">(Expires: {jobData.expireDate})</span>
            )}
          </div>
          {/* Description */}
          <div className={`text-gray-700 text-sm mb-2 ${!showFullDesc ? 'line-clamp-3' : ''} min-h-[40px]`}>
            <span className="font-bold">Description: </span>
            {desc.length > 120 ? (
              <>
                {desc.slice(0, 120)}...
                <button
                  className="text-blue-500 ml-1 text-xs underline hover:text-blue-700"
                  onClick={handleReadMoreClick}
                >
                  Read more
                </button>
              </>
            ) : (
              desc
            )}
          </div>
        </div>
        {/* Company Section (in main content for both views) */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-xs text-gray-700">Company:</span>
            <span className="text-xs text-gray-800 font-semibold truncate">{jobData.companyName}</span>
            {jobData.companyWebsite && (
              <a
                href={jobData.companyWebsite}
                className="text-blue-500 text-xs ml-2"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                Website
              </a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-1">
            <span>
              <span className="font-bold">Industry:</span> {
                jobData.companyIndustries.length > 0 ? jobData.companyIndustries.join(', ') : '-'
              }
            </span>
            <span>
              <span className="font-bold">Specialities:</span> {
                jobData.companySpecialities.length > 0 ? jobData.companySpecialities.join(', ') : '-'
              }
            </span>
          </div>
        </div>
        {/* Meta Section */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
          <span><span className="font-bold">Size:</span> {jobData.companyEmployeeCount}</span>
          <span><span className="font-bold">Followers:</span> {jobData.companyFollowerCount}</span>
          <span><span className="font-bold">Salary:</span> {jobData.salary || '-'}</span>
          {jobData.locationString && (
            <span><span className="font-bold">Location:</span> {jobData.locationString}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 mt-auto pt-2">
          {jobData.linkedinUrl && (
            <div className={view === "list" ? "flex flex-col justify-between items-end ml-auto" : "flex justify-end w-full"}>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                onClick={handleViewJob}
                tabIndex={0}
              >
                View Job
              </button>
            </div>
          )}
          {jobData.easyApplyUrl && (
            <a
              href={jobData.easyApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline text-xs"
              onClick={handleLinkClick}
            >
              Easy Apply
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
