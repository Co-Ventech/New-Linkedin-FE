import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getJobById } from "../api/jobService";

const API_URL = "http://192.168.100.69:3000/api/jobs/search";

// Use the same mockJobs as in Dashboard for now

// const mockJobs = [
//   {
//     id: "li-4258624375",
//     site: "linkedin",
//     job_url: "https://www.linkedin.com/jobs/view/4258624375",
//     job_url_direct: "",
//     title: "Full Stack Engineer",
//     company: "Unico Connect",
//     location: "Mumbai, Maharashtra, India",
//     date_posted: "",
//     job_type: "fulltime",
//     salary_source: "",
//     interval: "",
//     min_amount: "",
//     max_amount: "",
//     currency: "",
//     is_remote: "False",
//     job_level: "mid-senior level",
//     job_function: "Information Technology",
//     listing_type: "",
//     emails: "",
//     description: `**About Unico Connect**\n\nUnico Connect is a dynamic and innovative technology company that specializes in creating cutting-edge web and mobile applications for a wide range of industries including fintech, edtech, healthtech, and more. We blend traditional engineering with modern frameworks, no-code platforms, and automation to deliver impactful digital products. We are seeking a talented Full Stack Developer with strong MERN stack expertise to join our team and contribute to the development of user-centric, scalable, and performance-driven applications.\n\n**About the Role**\n\nWe are seeking a talented and self-driven Full Stack Developer (MERN Stack) to join our dynamic team. You will be responsible for developing and maintaining full-stack applications using MongoDB, Express.js, React.js, and Node.js. The ideal candidate will have a strong passion for coding, be committed to building scalable applications, and demonstrate a knack for solving complex problems with clean and efficient code.\n\n**Key Responsibilities**\n- Collaborate with the design and product teams to translate UI/UX designs into high-quality code\n- Develop scalable and reusable front-end components using React.js and state management libraries like Redux\n- Build robust RESTful APIs and backend services using Node.js and Express.js\n- Work with MongoDB for database design, performance optimization, and query handling\n- Optimize applications for performance, speed, and scalability\n- Debug and resolve technical issues across the full stack\n- Write clean, maintainable, and well-documented code\n- Work on No-Code/Low-Code platforms when required\n- Participate in code reviews, team meetings, and technical discussions\n- Stay updated with the latest trends and advancements in full stack and web technologies\n\n**Requirements**\n- Bachelor's or Master's degree in Computer Science, IT, or a related field\n- 3+ years of hands-on experience in full stack web development\n- Proficiency in JavaScript, HTML5, CSS3\n- Strong expertise in the MERN Stack (MongoDB, Express.js, React.js, Node.js)\n- Experience with Next.js is a plus\n- Familiarity with GraphQL is an advantage\n- Working knowledge of modern build tools like Webpack, Babel, and version control systems like Git\n- Solid understanding of RESTful APIs, authentication, and security best practices\n- Strong debugging and performance optimization skills\n- Good communication, research, and project management skills\n\n**Nice to Have**\n- Experience working with cloud platforms like AWS, Azure, or Firebase\n- Exposure to CI/CD tools and DevOps practices\n- Previous experience with Agile methodologies\n\n**Why Join Us?**\n- Work with a skilled team in a collaborative environment\n- Flexible work setup and growth opportunities\n- Exposure to diverse projects across industries`,
//     company_industry: "IT Services and IT Consulting",
//     company_url: "https://in.linkedin.com/company/unico-connect",
//     company_logo: "https://media.licdn.com/dms/image/v2/C4D0BAQHvMmczdPGU6g/company-logo_100_100/company-logo_100_100/0/1657528020504/unico_connect_logo?e=2147483647&v=beta&t=ZTPfPDfXHNRcAWR8MzSLWOq3PrlalTRbjnEgWOnN50Y",
//     company_url_direct: "",
//     company_addresses: "",
//     company_num_employees: "",
//     company_revenue: "",
//     company_description: "",
//     skills: "",
//     experience_range: "",
//     company_rating: "",
//     company_reviews_count: "",
//     vacancy_count: "",
//     work_from_home_type: ""
//   }
// ];

const tierColor = (tier) => {
  if (!tier) return "bg-gray-200 text-gray-700";
  if (tier.toLowerCase() === "yellow") return "bg-yellow-200 text-yellow-800";
  if (tier.toLowerCase() === "green") return "bg-green-200 text-green-800";
  if (tier.toLowerCase() === "red") return "bg-red-200 text-red-800";
  return "bg-gray-200 text-gray-700";
};

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

// KPI badge color logic
const getKpiBadge = (score) => {
  if (typeof score !== 'number') score = parseFloat(score);
  if (isNaN(score)) return { color: 'bg-gray-200 text-gray-700 border-gray-300', tag: '' };
  if (score >= 0.7) return { color: 'bg-green-100 text-green-800 border-green-400', tag: 'Green' };
  if (score >= 0.5) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-400', tag: 'Yellow' };
  return { color: 'bg-red-100 text-red-800 border-red-400', tag: 'Red' };
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [job, setJob] = useState(state?.job || null);
  const [loading, setLoading] = useState(!state?.job);
  const [error, setError] = useState("");

  useEffect(() => {
    if (job) return; // Already have job from state
    const fetchJob = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem('authToken');
        const found = await getJobById(id, token);
        setJob(found || null);
      } catch (err) {
        setError(err.message || "Failed to fetch job details.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, job]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading job details...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">{error}</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Job not found</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${badgeClass.tier[job.tier] || badgeClass.tier.Default}`} title="Tier">{job.tier}</span>
            )}
          </div>
          {/* Location display */}
          {job.locations && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-bold">Location:</span> {(() => {
                if (Array.isArray(job.locations)) {
                  if (typeof job.locations[0] === 'object' && job.locations[0] !== null && 'country' in job.locations[0]) {
                    return job.locations.map(loc => [loc.city, loc.state, loc.country].filter(Boolean).join(', ')).join(' | ');
                  }
                  // If array of strings
                  return job.locations.join(' | ');
                }
                // If single string
                return job.locations;
              })()}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {job.employmentType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.jobType}`} title="Job Type">{job.employmentType}</span>}
            {job.workplaceType && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.workplace}`} title="Workplace Type">{job.workplaceType}</span>}
            {job.applicants && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.applicants}`} title="Applicants">{job.applicants} Applicants</span>}
            {job.views && <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${badgeClass.views}`} title="Views">{job.views} Views</span>}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
            <span className="font-bold">Posted: {job.postedDate ? new Date(job.postedDate).toLocaleString() : '-'}</span>
            {job.expireAt && <span className="font-bold">Expires: {new Date(job.expireAt).toLocaleString()}</span>}
            <span><span className="font-bold">Salary:</span> {job.salary || '-'}</span>
          </div>
        </section>
        {/* Company Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">About the Company</h2>
          <div className="flex items-center gap-2 mb-2">
            {job.companyLogo && (
              <a href={job.companyUrl} target="_blank" rel="noopener noreferrer">
                <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded object-contain border border-gray-200" />
              </a>
            )}
            <span className="font-bold text-xs text-gray-700">Company:</span>
            <span className="text-xs text-gray-800 font-semibold truncate">{job.company || 'Company'}</span>
            {job.companyWebsite && (
              <a href={job.companyWebsite} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">Website</a>
            )}
            {job.companyUrl && (
              <a href={job.companyUrl} className="text-blue-500 text-xs ml-2" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span><span className="font-bold">Size:</span> {job.companyEmployeeCount || '-'}</span>
            <span><span className="font-bold">Followers:</span> {job.companyFollowerCount || '-'}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
            <span className="line-clamp-2 max-w-full"><span className="font-bold">Industry:</span> {Array.isArray(job.companyIndustries) ? job.companyIndustries.join(', ') : job.companyIndustries || '-'}</span>
            <span className="line-clamp-2 max-w-full"><span className="font-bold">Specialities:</span> {Array.isArray(job.companySpecialities) ? job.companySpecialities.join(', ') : job.companySpecialities || '-'}</span>
          </div>
          <div className="mb-2"><span className="font-bold">Description:</span> {job.companyDescription || '-'}</div>
        </section>
        {/* Job Description Section */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-lg font-bold mb-3 text-gray-800">Job Description</h2>
          <div className="prose prose-sm max-w-none whitespace-pre-line mb-2">{job.descriptionText}</div>
          <div className="flex gap-4 mt-2">
            <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Job</a>
            {job.easyApplyUrl && (
              <a href={job.easyApplyUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">Easy Apply</a>
            )}
          </div>
        </section>
        {/* KPIs Section */}
        <section className="mb-2">
          <h2 className="text-lg font-bold mb-3 text-gray-800">KPIs</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: 'JD Quality', value: job.kpi_jd_quality },
              { label: 'Domain Fit', value: job.kpi_domain_fit },
              { label: 'Seniority Alignment', value: job.kpi_seniority_alignment },
              { label: 'Location Priority', value: job.kpi_location_priority },
              { label: 'Company Specialties', value: job.kpi_company_specialties },
              { label: 'Salary', value: job.kpi_salary },
              { label: 'Company Size', value: job.kpi_company_size },
              { label: 'Company Popularity', value: job.kpi_company_popularity },
              { label: 'Industry Match', value: job.kpi_industry_match },
              { label: 'Job Popularity', value: job.kpi_job_popularity },
              { label: 'Job Freshness', value: job.kpi_job_freshness },
              { label: 'Employment Type', value: job.kpi_employment_type },
              { label: 'Contact Info', value: job.kpi_contact_info },
              { label: 'Skills Explicitness', value: job.kpi_skills_explicitness },
              { label: 'Experience Threshold', value: job.kpi_experience_threshold },
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
              <span className="text-xs font-bold min-w-[36px] text-center">{job.final_score !== undefined && job.final_score !== '' ? `${Math.round(parseFloat(job.final_score) * 100)}%` : '-'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetails; 