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
        <div className="flex items-center gap-4 mb-4">
          {job["Company Logo"] && (
            <img src={job["Company Logo"]} alt={job["Company"]} className="w-16 h-16 rounded object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-bold mb-1">{job["Job Title"]}</h1>
            <div className="text-gray-600 font-medium">{job["Company"]}</div>
            <div className="text-gray-500 text-sm">{job["Locations"] || job["Cities"] || job["Countries"]}</div>
            {job["Company URL"] && (
              <a href={job["Company URL"]} className="text-blue-500 text-xs" target="_blank" rel="noopener noreferrer">
                {job["Company URL"]}
              </a>
            )}
          </div>
          {job["tier"] && (
            <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${tierColor(job["tier"])}`}>
              {job["tier"]}
            </span>
          )}
        </div>
        <div className="mb-4">
          <a href={job["Job URL"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Job</a>
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {job["Employment Type"] && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{job["Employment Type"]}</span>
          )}
          {job["Seniority Level"] && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{job["Seniority Level"]}</span>
          )}
          {job["Remote"] === "True" && <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Remote</span>}
          {job["Source"] && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{job["Source"]}</span>}
        </div>
        <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
          {job["Job Description"]}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          {job["Recruiter Name"] && <div><span className="font-semibold">Recruiter:</span> {job["Recruiter Name"]} {job["Recruiter Title"] && <span className="text-gray-400">({job["Recruiter Title"]})</span>}</div>}
          {job["Recruiter URL"] && <div><span className="font-semibold">Recruiter Profile:</span> <a href={job["Recruiter URL"]} className="text-blue-500" target="_blank" rel="noopener noreferrer">{job["Recruiter URL"]}</a></div>}
          {job["Company Size"] && <div><span className="font-semibold">Company Size:</span> {job["Company Size"]}</div>}
          {job["Company Followers"] && <div><span className="font-semibold">Followers:</span> {job["Company Followers"]}</div>}
          {job["Industry"] && <div><span className="font-semibold">Industry:</span> {job["Industry"]}</div>}
          {job["Company Slogan"] && <div><span className="font-semibold">Slogan:</span> {job["Company Slogan"]}</div>}
          {job["Company Description"] && <div className="sm:col-span-2"><span className="font-semibold">Company Description:</span> {job["Company Description"]}</div>}
          {job["Date Posted"] && <div><span className="font-semibold">Date Posted:</span> {new Date(job["Date Posted"]).toLocaleString()}</div>}
          {job["Valid Through"] && <div><span className="font-semibold">Valid Through:</span> {new Date(job["Valid Through"]).toLocaleString()}</div>}
          {job["Location Type"] && <div><span className="font-semibold">Location Type:</span> {job["Location Type"]}</div>}
          {job["Salary"] && <div><span className="font-semibold">Salary:</span> {job["Salary"]}</div>}
          {job["Company Employees"] && <div><span className="font-semibold">Employees:</span> {job["Company Employees"]}</div>}
          {job["Company HQ"] && <div><span className="font-semibold">HQ:</span> {job["Company HQ"]}</div>}
          {job["Company Type"] && <div><span className="font-semibold">Type:</span> {job["Company Type"]}</div>}
          {job["Company Founded"] && <div><span className="font-semibold">Founded:</span> {job["Company Founded"]}</div>}
          {job["Company Specialties"] && <div><span className="font-semibold">Specialties:</span> {job["Company Specialties"]}</div>}
          {job["Seniority Level"] && <div><span className="font-semibold">Seniority Level:</span> {job["Seniority Level"]}</div>}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          <span className="font-semibold">Job ID:</span> {job["Job ID"]}
        </div>
        {/* KPIs Section */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Job KPIs</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="font-semibold">JD Quality:</span> {job["kpi_jd_quality"]}</div>
            <div><span className="font-semibold">Domain Fit:</span> {job["kpi_domain_fit"]}</div>
            <div><span className="font-semibold">Seniority:</span> {job["kpi_seniority"]}</div>
            <div><span className="font-semibold">Location:</span> {job["kpi_location"]}</div>
            <div><span className="font-semibold">Remote:</span> {job["kpi_remote"]}</div>
            <div><span className="font-semibold">Salary:</span> {job["kpi_salary"]}</div>
            <div><span className="font-semibold">Company Size:</span> {job["kpi_company_size"]}</div>
            <div><span className="font-semibold">Popularity:</span> {job["kpi_popularity"]}</div>
            <div><span className="font-semibold">Industry Match:</span> {job["kpi_industry_match"]}</div>
            <div><span className="font-semibold">Recruiter:</span> {job["kpi_recruiter"]}</div>
            <div><span className="font-semibold">Freshness:</span> {job["kpi_freshness"]}</div>
            <div><span className="font-semibold">Employment Type:</span> {job["kpi_employment_type"]}</div>
            <div><span className="font-semibold">Contact Info:</span> {job["kpi_contact_info"]}</div>
            <div><span className="font-semibold">Skills Explicitness:</span> {job["kpi_skills_explicitness"]}</div>
            <div><span className="font-semibold">Experience Threshold:</span> {job["kpi_experience_threshold"]}</div>
            <div><span className="font-semibold">Final Score:</span> {job["final_score"]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 