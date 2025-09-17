// import React, { useMemo } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

// const Section = ({ title, items }) => {
//   if (!Array.isArray(items) || items.length === 0) return null;
//   return (
//     <section className="mb-6 border-b pb-4">
//       <h2 className="text-lg font-bold mb-3 text-gray-800">{title}</h2>
//       <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
//         {items.map((t, i) => <li key={i}>{t}</li>)}
//       </ul>
//     </section>
//   );
// };

// const getItemsByTitle = (highlights, re) => {
//   const sec = (highlights || []).find(h => re.test(h?.title || ""));
//   return Array.isArray(sec?.items) ? sec.items : [];
// };

// const GoogleJobDetails = () => {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const loc = useLocation();
//   const stateJob = loc.state?.job;

//   const groups = useSelector(s => s.jobs.googleFileJobsByDate);
//   const job = useMemo(() => {
//     if (stateJob) return stateJob;
//     const key = decodeURIComponent(id || "");
//     for (const g of groups) {
//       const found = (g.jobs || []).find(j => String(j._id) === key);
//       if (found) return found;
//     }
//     return null;
//   }, [groups, id, stateJob]);

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-gray-600">Job not found.</div>
//           <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => nav(-1)}>
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const title = job?.title || "Job Title";
//   const company = job?.company_name || job?.company || "Company";
//   const location = job?.location && String(job.location).trim() !== "" ? job.location : "Remote";
//   const extensions = Array.isArray(job.extensions) ? job.extensions : [];
//   const posted = extensions.find(x => /hour|day|week|month|ago/i.test(x)) || null;
//   const salary = job.salary_range || job.hourly_rate || extensions.find(x => /\$|usd|salary|hour|year|comp/i.test(String(x))) || null;
//   const remote = extensions.find(x => /remote|work\s*from\s*home|hybrid/i.test(x)) || job.detected_extensions?.work_from_home ? "Remote" : null;

//   const highlights = Array.isArray(job.job_highlights) ? job.job_highlights : [];
//   const summary = getItemsByTitle(highlights, /summary/i);
//   const responsibilities = getItemsByTitle(highlights, /(key\s*)?responsibilit/i);
//   const qualifications = getItemsByTitle(highlights, /qualification/i);
//   const benefits = getItemsByTitle(highlights, /benefit/i);

//   const applyLinks = Array.isArray(job.apply_options) ? job.apply_options : [];
//   const mainApply = applyLinks.length > 0 ? applyLinks[0] : null;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
//         <button className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300" onClick={() => nav(-1)}>
//           ← Back to Jobs
//         </button>

//         <section className="mb-6 border-b pb-4">
//           <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
//           <div className="text-sm text-gray-700">{company}</div>
//           <div className="text-sm text-gray-600">{location}</div>
//           <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
//             {posted && <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{posted}</span>}
//             {salary && <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{String(salary)}</span>}
//             {remote && <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{remote}</span>}
//           </div>
//           {mainApply?.link && (
//             <div className="mt-2">
//               <a href={mainApply.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
//                 Apply
//               </a>
//             </div>
//           )}
//         </section>

//         <Section title="Summary" items={summary} />
//         <Section title="Key Responsibilities" items={responsibilities} />
//         <Section title="Qualifications" items={qualifications} />
//         <Section title="Benefits" items={benefits} />

//         <section className="mb-6 border-b pb-4">
//           <h2 className="text-lg font-bold mb-3 text-gray-800">How to Apply</h2>
//           {applyLinks.length > 0 ? (
//             <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
//               {applyLinks.map((a, i) => (
//                 <li key={i}>
//                   <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
//                     {a.title || a.link}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="text-sm text-gray-600">No apply options available.</div>
//           )}
//         </section>

//         {job.description_preview && (
//           <section>
//             <h2 className="text-lg font-bold mb-3 text-gray-800">Full Description (Preview)</h2>
//             <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-700">
//               {job.description_preview}
//             </div>
//           </section>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GoogleJobDetails;



// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

// const GoogleJobDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const groups = useSelector((state) => state.jobs.googleFileJobsByDate);

//   const job = groups
//     ?.flatMap((group) => group.jobs)
//     ?.find((job) => job._id === id);

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Job not found.</p>
//           <button
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={() => navigate(-1)}
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
//         <button
//           className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
//           onClick={() => navigate(-1)}
//         >
//           ← Back to Jobs
//         </button>
//         <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
//         <p className="text-sm text-gray-700">{job.company_name}</p>
//         <p className="text-sm text-gray-600">{job.location || "Remote"}</p>
//         <div className="mt-4">
//           <h2 className="text-lg font-bold text-gray-800">Description</h2>
//           <p className="text-sm text-gray-700">{job.description_preview || "No description available."}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GoogleJobDetails;


// import React, { useMemo } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useSelector } from "react-redux";

// const GoogleJobDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const stateJob = location.state?.job; // Retrieve job from state if passed

//   const groups = useSelector((state) => state.jobs.googleFileJobsByDate);

//   // Find the job by ID if not passed via state
//   const job = useMemo(() => {
//     if (stateJob) return stateJob;
//     const key = decodeURIComponent(id || "");
//     for (const group of groups || []) {
//       const found = (group.jobs || []).find((j) => String(j._id) === key);
//       if (found) return found;
//     }
//     return null;
//   }, [groups, id, stateJob]);

//   if (!job) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600">Job not found.</p>
//           <button
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             onClick={() => navigate(-1)}
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
//       <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
//         <button
//           className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
//           onClick={() => navigate(-1)}
//         >
//           ← Back to Jobs
//         </button>
//         <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
//         <p className="text-sm text-gray-700">{job.company_name}</p>
//         <p className="text-sm text-gray-600">{job.location || "Remote"}</p>
//         <div className="mt-4">
//           <h2 className="text-lg font-bold text-gray-800">Description</h2>
//           <p className="text-sm text-gray-700">{job.description_preview || "No description available."}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GoogleJobDetails;



import React, { useMemo, useState } from "react";
import { useLocation as useRouterLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Section = ({ title, items }) => {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section className="mb-6 border-b pb-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800">{title}</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
};

const GoogleJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation(); // Renamed to avoid conflict
  const stateJob = routerLocation.state?.job; // Retrieve job from state if passed

  const groups = useSelector((state) => state.jobs.googleFileJobsByDate);

  // Find the job by ID if not passed via state
  const job = useMemo(() => {
    if (stateJob) return stateJob;
    const key = decodeURIComponent(id || "");
    for (const group of groups || []) {
      const found = (group.jobs || []).find((j) => String(j._id) === key);
      if (found) return found;
    }
    return null;
  }, [groups, id, stateJob]);

  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Job not found.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const title = job?.title || "Job Title";
  const company = job?.company_name || job?.company || "Company";
  const location = job?.location && String(job.location).trim() !== "" ? job.location : "Remote";
  const extensions = Array.isArray(job.extensions) ? job.extensions : [];
  const posted = extensions.find((ext) => /hour|day|week|month|ago/i.test(ext)) || null;
  const salary = job.salary_range || job.hourly_rate || extensions.find((ext) => /\$|usd|salary|hour|year|comp/i.test(String(ext))) || null;
  const remote = extensions.find((ext) => /remote|work\s*from\s*home|hybrid/i.test(ext)) || job.detected_extensions?.work_from_home ? "Remote" : null;
  const jobType = job.job_type || "Not specified";

  const highlights = Array.isArray(job.job_highlights) ? job.job_highlights : [];
  const summary = highlights.find((h) => /summary/i.test(h?.title || ""))?.items || [];
  const responsibilities = highlights.find((h) => /(key\s*)?responsibilit/i.test(h?.title || ""))?.items || [];
  const qualifications = highlights.find((h) => /qualification/i.test(h?.title || ""))?.items || [];
  const experience = highlights.find((h) => /experience/i.test(h?.title || ""))?.items || [];
  const benefits = highlights.find((h) => /benefit/i.test(h?.title || ""))?.items || [];
  const applyLinks = Array.isArray(job.apply_options) ? job.apply_options : [];
  const mainApply = applyLinks.length > 0 ? applyLinks[0] : null;

  const descriptionPreview = job.description_preview || "No description available.";
  const truncatedDescription = descriptionPreview.slice(0, 300);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <button
          className="mb-6 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          ← Back to Jobs
        </button>

        <section className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <div className="text-sm text-gray-700">{company}</div>
          <div className="text-sm text-gray-600">{location}</div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
            {posted && <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{posted}</span>}
            {salary && <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{String(salary)}</span>}
            {remote && <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{remote}</span>}
            {jobType && <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">{jobType}</span>}
          </div>
          {mainApply?.link && (
            <div className="mt-2">
              <a
                href={mainApply.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg shadow hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                Apply
              </a>
            </div>
          )}

        </section>

        <Section title="Summary" items={summary} />
        <Section title="Key Responsibilities" items={responsibilities} />
        <Section title="Required Skills and Qualifications" items={qualifications} />
        <Section title="Experience" items={experience} />
        <Section title="Benefits" items={benefits} />

        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">How to Apply</h2>
          {applyLinks.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
              {applyLinks.map((a, i) => (
                <li key={i}>
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Apply via {a.title || "Link"}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-600">No apply options available.</div>
          )}
        </section>
        {/* <section className="mb-6 border-b pb-4">
  <h2 className="text-lg font-bold mb-3 text-gray-800">How to Apply</h2>
  {applyLinks.length > 0 ? (
    <ul className="space-y-2">
      {applyLinks.map((a, i) => (
        <li key={i}>
          <a
            href={a.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-2 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 active:bg-blue-700 transition-colors cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            Apply via {a.title || "Link"}
          </a>
        </li>
      ))}
    </ul>
  ) : (
    <div className="text-sm text-gray-600">No apply options available.</div>
  )}
</section> */}


        {job.description_preview && (
          <section>
            <h2 className="text-lg font-bold mb-3 text-gray-800">Full Description (Preview)</h2>
            <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-700">
              {showFullDescription ? descriptionPreview : truncatedDescription}
              {descriptionPreview.length > 300 && (
                <button
                  className="text-blue-600 hover:underline ml-2"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </section>
        )}

        {job.share_link && (
          <div className="mt-6">
            <a
              href={job.share_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Original Posting
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleJobDetails;