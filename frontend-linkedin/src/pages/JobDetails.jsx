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
          {job.organization_logo && (
            <img src={job.organization_logo} alt={job.organization} className="w-16 h-16 rounded object-contain" />
          )}
          <div>
            <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
            <div className="text-gray-600 font-medium">{job.organization}</div>
            <div className="text-gray-500 text-sm">{job.location}</div>
          </div>
        </div>
        <div className="mb-4">
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View on LinkedIn</a>
        </div>
        <div className="mb-4">
          {job.employment_type && job.employment_type.map(type => (
            <span key={type} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2">{type}</span>
          ))}
          {job.seniority && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">{job.seniority}</span>
          )}
          {job.remote_derived && <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Remote</span>}
        </div>
        <div className="prose prose-sm max-w-none mb-6 whitespace-pre-line">
          {job.description_text}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {job.company_industry && <div><span className="font-semibold">Industry:</span> {job.company_industry}</div>}
          {job.company_url && <div><span className="font-semibold">Company URL:</span> <a href={job.company_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{job.company_url}</a></div>}
          {job.salary_source && <div><span className="font-semibold">Salary:</span> {job.salary_source}</div>}
          {job.job_level && <div><span className="font-semibold">Level:</span> {job.job_level}</div>}
          {job.emails && <div><span className="font-semibold">Contact:</span> {job.emails}</div>}
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 