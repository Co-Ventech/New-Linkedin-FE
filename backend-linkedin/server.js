// // server.js
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const axios = require('axios');
// const jobRoutes = require('./routes/jobRoutes');
// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// // // 404 route
// // app.use('ss', (req, res) => {
// //   res.status(404).json({ message: "404 - Route not found" });
// // });

// const jobRoutes2 = require('./routes/jobRoutes');
// const csvRoutes2 = require('./routes/csvRoutes');
// app.use('/api2/jobs', jobRoutes2);
// app.use('/api2/csv', csvRoutes2);

// const linkedinJobRoutes = require('./routes/linkedinJobRoutes');
// const csvExportRoutes = require('./routes/csvExportRoutes');

// app.use('/api/linkedin-jobs', linkedinJobRoutes);
// app.use('/api/csv-export', csvExportRoutes);

// app.use('/api/jobs', jobRoutes);

// const PORT = process.env.PORT || 5001;

// // Middleware
// // Routes
// const jobRoutes1 = require('./routes/jobRoutes copy.js');
// app.use('/api/jobs1', jobRoutes1);

// // app.post('/api/jobs/search1', async (req, res) => {
// //   try {
// //     const {
// //       search_term = 'ai ml',
// //       location = 'usa',
// //       results_wanted = 5,
// //       site_name = ['linkedin'],
// //       distance = 50,
// //       job_type = 'fulltime',
// //       is_remote = true,
// //       linkedin_fetch_description = true,
// //       hours_old = 72
// //     } = req.body;

// //     const options = {
// //       method: 'POST',
// //       url: 'https://jobs-search-api.p.rapidapi.com/getjobs',
// //       headers: {
// //         'x-rapidapi-key': process.env.RAPIDAPI_KEY,
// //         'x-rapidapi-host': 'jobs-search-api.p.rapidapi.com',
// //         'Content-Type': 'application/json'
// //       },
// //       data: {
// //         search_term,
// //         location,
// //         results_wanted,
// //         site_name,
// //         distance,
// //         job_type,
// //         is_remote,
// //         linkedin_fetch_description,
// //         hours_old
// //       }
// //     };

// //     const response = await axios(options);

// //     res.json({
// //       success: true,
// //       data: response.data,
// //       searchParams: {
// //         search_term,
// //         location,
// //         results_wanted,
// //         site_name,
// //         distance,
// //         job_type,
// //         is_remote,
// //         linkedin_fetch_description,
// //         hours_old
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Error fetching jobs:', error.response?.data || error.message);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to fetch jobs',
// //       error: error.response?.data || error.message
// //     });
// //   }
// // });

// // // Health check endpoint
// // app.get('/api/health', (req, res) => {
// //   res.json({ message: 'Job Search API is running!' });
// // });

// // Start the server
// // app.listen(PORT, () => {
// //     console.log(`Server is running on port ${PORT}`);
// // });
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📡 Job Search: http://localhost:${PORT}/api2/jobs/search`);
//   console.log(`📁 CSV Save: http://localhost:${PORT}/api2/csv/save`);
//   console.log(`📥 CSV Download: http://localhost:${PORT}/api2/csv/download`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received. Shutting down gracefully...');
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received. Shutting down gracefully...');
//   process.exit(0);
// });

// // app.post('/test', (req, res) => {
// //     res.json({ message: 'Test route' });
// // } );

// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Single LinkedIn Job Search API Endpoint
// app.post('/api/linkedin-jobs', async (req, res) => {
//   try {
//     console.log('🔍 LinkedIn Job Search Request:', req.body);

//     // Extract parameters with defaults
//     const {
//       limit = 10,
//       offset = 0,
//       location_filter = '"United States" OR "United Kingdom"',
//       advanced_title_filter = '(AI | \'Machine Learning\' | \'Robotics\')',
//       description_type = 'text',
//       remote = true,
//       title_filter
//     } = req.body;

//     // Validate parameters
//     if (limit < 1 || limit > 100) {
//       return res.status(400).json({
//         success: false,
//         message: 'Limit must be between 1 and 100'
//       });
//     }

//     if (offset < 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Offset must be a positive number'
//       });
//     }

//     // Build API parameters
//     const apiParams = {
//       limit: limit.toString(),
//       offset: offset.toString(),
//       location_filter,
//       description_type,
//       remote: remote.toString(),
//       advanced_title_filter
//     };

//     // Only add title_filter if provided
//     if (title_filter && title_filter.trim() !== '') {
//       apiParams.title_filter = title_filter;
//     }

//     console.log('📡 Sending to LinkedIn API:', apiParams);

//     // Call LinkedIn API
//     const options = {
//       method: 'GET',
//       url: 'https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h',
//       params: apiParams,
//       headers: {
//         'x-rapidapi-key': process.env.RAPIDAPI_KEY,
//         'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com'
//       }
//     };

//     const response = await axios.request(options);

//     console.log('✅ LinkedIn API Response Status:', response.status);
//     console.log('📊 Jobs Found:', response.data?.jobs?.length || 0);

//     // Return formatted response
//     res.json({
//       success: true,
//       data: {
//         jobs: response.data?.jobs || [],
//         totalJobs: response.data?.jobs?.length || 0,
//         hasMore: response.data?.jobs?.length === limit,
//         currentOffset: offset,
//         nextOffset: offset + limit
//       },
//       searchParams: {
//         limit,
//         offset,
//         location_filter,
//         advanced_title_filter,
//         title_filter: title_filter || null,
//         description_type,
//         remote
//       },
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('❌ LinkedIn API Error:', error.response?.status, error.response?.data);

//     res.status(error.response?.status || 500).json({
//       success: false,
//       message: 'Failed to fetch LinkedIn jobs',
//       error: error.response?.data?.message || error.message,
//       details: process.env.NODE_ENV === 'development' ? error.response?.data : undefined
//     });
//   }
// });

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'LinkedIn Job Search API is running!',
//     endpoint: 'linkedin-job-search-api.p.rapidapi.com',
//     timestamp: new Date().toISOString(),
//     version: '1.0.0'
//   });
// });

// // CSV Export endpoint (optional)
// app.post('/api/export-csv', (req, res) => {
//   try {
//     const { jobs } = req.body;

//     if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No job data provided for export'
//       });
//     }

//     // Simple CSV generation
//     const csvHeaders = [
//       'Job ID', 'Title', 'Company', 'Location', 'Remote',
//       'Employment Type', 'Date Posted', 'Job URL'
//     ];

//     const csvRows = jobs.map(job => [
//       job.id || '',
//       `"${(job.title || '').replace(/"/g, '""')}"`,
//       `"${(job.organization || job.company || '').replace(/"/g, '""')}"`,
//       `"${(job.locations_derived ? job.locations_derived.join(', ') : job.location || '').replace(/"/g, '""')}"`,
//       job.remote_derived || job.remote ? 'Yes' : 'No',
//       `"${(Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '').replace(/"/g, '""')}"`,
//       job.date_posted || '',
//       job.url || ''
//     ]);

//     const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename="linkedin_jobs.csv"');
//     res.send(csvContent);

//   } catch (error) {
//     console.error('❌ CSV Export Error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to export CSV',
//       error: error.message
//     });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 LinkedIn Job Search API running on port ${PORT}`);
//   console.log(`📡 Main endpoint: http://localhost:${PORT}/api/linkedin-jobs`);
//   console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
//   console.log(`📁 CSV export: http://localhost:${PORT}/api/export-csv`);
// });

// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// const PORT = 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // LinkedIn Job Search Endpoint
// app.post("/api/jobs", async (req, res) => {
//   try {
//     // Get parameters from request body with defaults
//     const {
//       limit = "5",
//       offset = "0",
//       //   title_filter = "Data Engineer",
//         location_filter = '"United States" OR "United Kingdom"' ,
//     //   location_filter = 'Fran',
//     //   location_filter = '"worldwide"',
//      description_type ='text',
//       remote = 'true',
//       advanced_title_filter = '(QA)'
//     } = req.body;

//     // Exact same structure as your working code
//     const options = {
//       method: "GET",
//       url: "https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h",
//       params: {
//         limit,
//         offset,
//         // title_filter,
//         location_filter,
//         remote,
//         description_type,
//         advanced_title_filter,
//       },
//       headers: {
//         "x-rapidapi-key": "210b8f9226msh36c099be1567124p184438jsn3e86670cf03d",
//         "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
//       },
//     };

//     console.log("🔍 Fetching jobs with params:", options.params);

//     // Make the API call
//     const response = await axios.request(options);
//     console.log(response.data);

//     console.log("✅ Jobs found:", response.data?.jobs?.length || 0);
//     const jobs = Array.isArray(response.data) ? response.data : [];
//     const totalJobs = jobs.length;

//     // Return the data
//     res.json({
//       success: true,
//       //   jobsdata:response.data,
//       //   jobs: response.data?.jobs || [],
//       jobs: jobs,
//       totalJobs: totalJobs,

//       searchParams: options.params,
//     });
//   } catch (error) {
//     console.error("❌ Error:", error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message,
//     });
//   }
// });

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ message: "API is running!" });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/jobs`);
// });

// // best working and download file
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const fs = require('fs-extra');
// const path = require('path');

// const app = express();
// const PORT = 3001;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // CSV CONFIGURATION WITH ALL FIELDS
// const CSV_FILENAME = 'linkedin_jobs_complete.csv';
// const CSV_PATH = path.join(__dirname, CSV_FILENAME);

// const csvWriter = createCsvWriter({
//   path: CSV_PATH,
//   header: [
//     { id: 'id', title: 'Job ID' },
//     { id: 'date_posted', title: 'Date Posted' },
//     { id: 'date_created', title: 'Date Created' },
//     { id: 'title', title: 'Job Title' },
//     { id: 'organization', title: 'Company' },
//     { id: 'organization_url', title: 'Company URL' },
//     { id: 'date_validthrough', title: 'Valid Through' },
//     { id: 'location_type', title: 'Location Type' },
//     { id: 'salary_raw', title: 'Salary' },
//     { id: 'employment_type', title: 'Employment Type' },
//     { id: 'url', title: 'Job URL' },
//     { id: 'source_type', title: 'Source Type' },
//     { id: 'source', title: 'Source' },
//     { id: 'source_domain', title: 'Source Domain' },
//     { id: 'organization_logo', title: 'Company Logo' },
//     { id: 'cities_derived', title: 'Cities' },
//     { id: 'regions_derived', title: 'Regions' },
//     { id: 'countries_derived', title: 'Countries' },
//     { id: 'locations_derived', title: 'Locations' },
//     { id: 'timezones_derived', title: 'Timezones' },
//     { id: 'lats_derived', title: 'Latitudes' },
//     { id: 'lngs_derived', title: 'Longitudes' },
//     { id: 'remote_derived', title: 'Remote' },
//     { id: 'recruiter_name', title: 'Recruiter Name' },
//     { id: 'recruiter_title', title: 'Recruiter Title' },
//     { id: 'recruiter_url', title: 'Recruiter URL' },
//     { id: 'linkedin_org_employees', title: 'Company Employees' },
//     { id: 'linkedin_org_url', title: 'LinkedIn Company URL' },
//     { id: 'linkedin_org_size', title: 'Company Size' },
//     { id: 'linkedin_org_slogan', title: 'Company Slogan' },
//     { id: 'linkedin_org_industry', title: 'Industry' },
//     { id: 'linkedin_org_followers', title: 'Company Followers' },
//     { id: 'linkedin_org_headquarters', title: 'Company HQ' },
//     { id: 'linkedin_org_type', title: 'Company Type' },
//     { id: 'linkedin_org_foundeddate', title: 'Company Founded' },
//     { id: 'linkedin_org_specialties', title: 'Company Specialties' },
//     { id: 'linkedin_org_locations', title: 'Company Locations' },
//     { id: 'linkedin_org_description', title: 'Company Description' },
//     { id: 'linkedin_org_recruitment_agency_derived', title: 'Recruitment Agency' },
//     { id: 'seniority', title: 'Seniority Level' },
//     { id: 'directapply', title: 'Direct Apply' },
//     { id: 'linkedin_org_slug', title: 'Company Slug' },
//     { id: 'no_jb_schema', title: 'No JB Schema' },
//     { id: 'external_apply_url', title: 'External Apply URL' },
//     { id: 'description_text', title: 'Job Description' },
//     { id: 'locations_raw', title: 'Raw Locations' },
//     { id: 'location_requirements_raw', title: 'Location Requirements' }
//   ]
// });

// // HELPER FUNCTION TO TRANSFORM ALL FIELDS
// function transformJobData(jobs) {
//   return jobs.map(job => ({
//     id: job.id || '',
//     date_posted: job.date_posted || '',
//     date_created: job.date_created || '',
//     title: job.title || '',
//     organization: job.organization || '',
//     organization_url: job.organization_url || '',
//     date_validthrough: job.date_validthrough || '',
//     location_type: job.location_type || '',
//     salary_raw: job.salary_raw ? JSON.stringify(job.salary_raw) : '',
//     employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
//     url: job.url || '',
//     source_type: job.source_type || '',
//     source: job.source || '',
//     source_domain: job.source_domain || '',
//     organization_logo: job.organization_logo || '',
//     cities_derived: Array.isArray(job.cities_derived) ? job.cities_derived.join(', ') : '',
//     regions_derived: Array.isArray(job.regions_derived) ? job.regions_derived.join(', ') : '',
//     countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
//     locations_derived: Array.isArray(job.locations_derived) ? job.locations_derived.join(', ') : '',
//     timezones_derived: Array.isArray(job.timezones_derived) ? job.timezones_derived.join(', ') : '',
//     lats_derived: Array.isArray(job.lats_derived) ? job.lats_derived.join(', ') : '',
//     lngs_derived: Array.isArray(job.lngs_derived) ? job.lngs_derived.join(', ') : '',
//     remote_derived: job.remote_derived || false,
//     recruiter_name: job.recruiter_name || '',
//     recruiter_title: job.recruiter_title || '',
//     recruiter_url: job.recruiter_url || '',
//     linkedin_org_employees: job.linkedin_org_employees || '',
//     linkedin_org_url: job.linkedin_org_url || '',
//     linkedin_org_size: job.linkedin_org_size || '',
//     linkedin_org_slogan: job.linkedin_org_slogan || '',
//     linkedin_org_industry: job.linkedin_org_industry || '',
//     linkedin_org_followers: job.linkedin_org_followers || '',
//     linkedin_org_headquarters: job.linkedin_org_headquarters || '',
//     linkedin_org_type: job.linkedin_org_type || '',
//     linkedin_org_foundeddate: job.linkedin_org_foundeddate || '',
//     linkedin_org_specialties: Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '',
//     linkedin_org_locations: Array.isArray(job.linkedin_org_locations) ? job.linkedin_org_locations.join(', ') : '',
//     linkedin_org_description: job.linkedin_org_description ? job.linkedin_org_description.replace(/\n/g, ' ').replace(/"/g, '""') : '',
//     linkedin_org_recruitment_agency_derived: job.linkedin_org_recruitment_agency_derived || false,
//     seniority: job.seniority || '',
//     directapply: job.directapply || false,
//     linkedin_org_slug: job.linkedin_org_slug || '',
//     no_jb_schema: job.no_jb_schema || '',
//     external_apply_url: job.external_apply_url || '',
//     description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""') : '',
//     locations_raw: job.locations_raw ? JSON.stringify(job.locations_raw) : '',
//     location_requirements_raw: job.location_requirements_raw ? JSON.stringify(job.location_requirements_raw) : ''
//   }));
// }

// // LinkedIn Job Search Endpoint
// app.post("/api/jobs", async (req, res) => {
//   try {
//     const {
//       limit = "1",
//       offset = "0",
//       location_filter = '"United States" OR "United Kingdom"',
//       description_type = 'text',
//       remote = 'true',
//       advanced_title_filter = '(QA | \'Test Automation\' | \'Web Development\' | \'AI/ML\' | \'UI/UX\')'
//     } = req.body;

//     const options = {
//       method: "GET",
//       url: "https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h",
//       params: {
//         limit,
//         offset,
//         location_filter,
//         remote,
//         description_type,
//         advanced_title_filter,
//       },
//       headers: {
//         "x-rapidapi-key": "210b8f9226msh36c099be1567124p184438jsn3e86670cf03d",
//         "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
//       },
//     };

//     console.log("🔍 Fetching jobs with params:", options.params);

//     const response = await axios.request(options);
//     const jobs = Array.isArray(response.data) ? response.data : [];
//     const totalJobs = jobs.length;

//     // CREATE CSV WITH ALL FIELDS
//     if (jobs.length > 0) {
//       // Delete old CSV file if exists
//       if (await fs.pathExists(CSV_PATH)) {
//         await fs.remove(CSV_PATH);
//         console.log('🗑️ Old CSV file deleted');
//       }

//       // Transform and write new CSV with ALL fields
//       const csvData = transformJobData(jobs);
//       await csvWriter.writeRecords(csvData);
//       console.log(`✅ Complete CSV file saved with ${totalJobs} jobs and ALL fields`);
//     }

//     res.json({
//       success: true,
//       jobs: jobs,
//       totalJobs: totalJobs,
//       searchParams: options.params,
//       csvFile: jobs.length > 0 ? CSV_FILENAME : null,
//       message: `Saved ${totalJobs} jobs with complete data to CSV`
//     });

//   } catch (error) {
//     console.error("❌ Error:", error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message,
//     });
//   }
// });

// // CSV Download Endpoint
// app.get("/api/download-csv", (req, res) => {
//   if (fs.existsSync(CSV_PATH)) {
//     res.download(CSV_PATH, CSV_FILENAME, (err) => {
//       if (err) {
//         console.error('Download error:', err);
//         res.status(500).json({ success: false, message: 'Download failed' });
//       }
//     });
//   } else {
//     res.status(404).json({ success: false, message: 'CSV file not found' });
//   }
// });

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ message: "API is running!" });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📡 Endpoint: POST http://localhost:${PORT}/api/jobs`);
//   console.log(`📥 CSV Download: GET http://localhost:${PORT}/api/download-csv`);
// //   console.log(`📊 CSV will contain ALL ${csvWriter.header.length} fields from API`);
// });


const express = require("express");
const axios = require("axios");
const cors = require("cors");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');


// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));



const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
const router = require('./routes/authRoutes.js');

app.use('/api', router);

// CSV CONFIGURATION WITH ALL FIELDS
const CSV_FILENAME = 'linkedin_jobs_complete.csv';
const CSV_PATH = path.join(__dirname, CSV_FILENAME);

// DEFINE HEADERS SEPARATELY
const CSV_HEADERS = [
  { id: 'id', title: 'Job ID' },
  { id: 'date_posted', title: 'Date Posted' },
  { id: 'date_created', title: 'Date Created' },
  { id: 'title', title: 'Job Title' },
  { id: 'organization', title: 'Company' },
  { id: 'organization_url', title: 'Company URL' },
  { id: 'date_validthrough', title: 'Valid Through' },
  { id: 'location_type', title: 'Location Type' },
  { id: 'salary_raw', title: 'Salary' },
  { id: 'employment_type', title: 'Employment Type' },
  { id: 'url', title: 'Job URL' },
  { id: 'source_type', title: 'Source Type' },
  { id: 'source', title: 'Source' },
  { id: 'source_domain', title: 'Source Domain' },
  { id: 'organization_logo', title: 'Company Logo' },
  { id: 'cities_derived', title: 'Cities' },
  { id: 'regions_derived', title: 'Regions' },
  { id: 'countries_derived', title: 'Countries' },
  { id: 'locations_derived', title: 'Locations' },
  { id: 'timezones_derived', title: 'Timezones' },
  { id: 'lats_derived', title: 'Latitudes' },
  { id: 'lngs_derived', title: 'Longitudes' },
  { id: 'remote_derived', title: 'Remote' },
  { id: 'recruiter_name', title: 'Recruiter Name' },
  { id: 'recruiter_title', title: 'Recruiter Title' },
  { id: 'recruiter_url', title: 'Recruiter URL' },
  { id: 'linkedin_org_employees', title: 'Company Employees' },
  { id: 'linkedin_org_url', title: 'LinkedIn Company URL' },
  { id: 'linkedin_org_size', title: 'Company Size' },
  { id: 'linkedin_org_slogan', title: 'Company Slogan' },
  { id: 'linkedin_org_industry', title: 'Industry' },
  { id: 'linkedin_org_followers', title: 'Company Followers' },
  { id: 'linkedin_org_headquarters', title: 'Company HQ' },
  { id: 'linkedin_org_type', title: 'Company Type' },
  { id: 'linkedin_org_foundeddate', title: 'Company Founded' },
  { id: 'linkedin_org_specialties', title: 'Company Specialties' },
  { id: 'linkedin_org_locations', title: 'Company Locations' },
  { id: 'linkedin_org_description', title: 'Company Description' },
  { id: 'linkedin_org_recruitment_agency_derived', title: 'Recruitment Agency' },
  { id: 'seniority', title: 'Seniority Level' },
  { id: 'directapply', title: 'Direct Apply' },
  { id: 'linkedin_org_slug', title: 'Company Slug' },
  { id: 'no_jb_schema', title: 'No JB Schema' },
  { id: 'external_apply_url', title: 'External Apply URL' },
  { id: 'description_text', title: 'Job Description' },
  { id: 'locations_raw', title: 'Raw Locations' },
  { id: 'location_requirements_raw', title: 'Location Requirements' }
];

const csvWriter = createCsvWriter({
  path: CSV_PATH,
  header: CSV_HEADERS
});

// HELPER FUNCTION TO TRANSFORM ALL FIELDS
function transformJobData(jobs) {
  return jobs.map(job => ({
    id: job.id || '',
    date_posted: job.date_posted || '',
    date_created: job.date_created || '',
    title: job.title || '',
    organization: job.organization || '',
    organization_url: job.organization_url || '',
    date_validthrough: job.date_validthrough || '',
    location_type: job.location_type || '',
    salary_raw: job.salary_raw ? JSON.stringify(job.salary_raw) : '',
    employment_type: Array.isArray(job.employment_type) ? job.employment_type.join(', ') : job.employment_type || '',
    url: job.url || '',
    source_type: job.source_type || '',
    source: job.source || '',
    source_domain: job.source_domain || '',
    organization_logo: job.organization_logo || '',
    cities_derived: Array.isArray(job.cities_derived) ? job.cities_derived.join(', ') : '',
    regions_derived: Array.isArray(job.regions_derived) ? job.regions_derived.join(', ') : '',
    countries_derived: Array.isArray(job.countries_derived) ? job.countries_derived.join(', ') : '',
    locations_derived: Array.isArray(job.locations_derived) ? job.locations_derived.join(', ') : '',
    timezones_derived: Array.isArray(job.timezones_derived) ? job.timezones_derived.join(', ') : '',
    lats_derived: Array.isArray(job.lats_derived) ? job.lats_derived.join(', ') : '',
    lngs_derived: Array.isArray(job.lngs_derived) ? job.lngs_derived.join(', ') : '',
    remote_derived: job.remote_derived || false,
    recruiter_name: job.recruiter_name || '',
    recruiter_title: job.recruiter_title || '',
    recruiter_url: job.recruiter_url || '',
    linkedin_org_employees: job.linkedin_org_employees || '',
    linkedin_org_url: job.linkedin_org_url || '',
    linkedin_org_size: job.linkedin_org_size || '',
    linkedin_org_slogan: job.linkedin_org_slogan || '',
    linkedin_org_industry: job.linkedin_org_industry || '',
    linkedin_org_followers: job.linkedin_org_followers || '',
    linkedin_org_headquarters: job.linkedin_org_headquarters || '',
    linkedin_org_type: job.linkedin_org_type || '',
    linkedin_org_foundeddate: job.linkedin_org_foundeddate || '',
    linkedin_org_specialties: Array.isArray(job.linkedin_org_specialties) ? job.linkedin_org_specialties.join(', ') : '',
    linkedin_org_locations: Array.isArray(job.linkedin_org_locations) ? job.linkedin_org_locations.join(', ') : '',
    linkedin_org_description: job.linkedin_org_description ? job.linkedin_org_description.replace(/\n/g, ' ').replace(/"/g, '""') : '',
    linkedin_org_recruitment_agency_derived: job.linkedin_org_recruitment_agency_derived || false,
    seniority: job.seniority || '',
    directapply: job.directapply || false,
    linkedin_org_slug: job.linkedin_org_slug || '',
    no_jb_schema: job.no_jb_schema || '',
    external_apply_url: job.external_apply_url || '',
    description_text: job.description_text ? job.description_text.replace(/\n/g, ' ').replace(/"/g, '""') : '',
    locations_raw: job.locations_raw ? JSON.stringify(job.locations_raw) : '',
    location_requirements_raw: job.location_requirements_raw ? JSON.stringify(job.location_requirements_raw) : ''
  }));
}

// SHARED FUNCTION TO FETCH JOBS FROM LINKEDIN API
async function fetchJobsFromLinkedIn(searchParams) {
  const options = {
    method: "GET",
    url: "https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h",
    params: searchParams,
    headers: {
      "x-rapidapi-key": "210b8f9226msh36c099be1567124p184438jsn3e86670cf03d",
      "x-rapidapi-host": "linkedin-job-search-api.p.rapidapi.com",
    },
  };

  console.log("🔍 Fetching jobs with params:", options.params);

  const response = await axios.request(options);
  const jobs = Array.isArray(response.data) ? response.data : [];
  
  console.log("✅ Jobs found:", jobs.length);
  
  return jobs;
}

// SHARED FUNCTION TO CREATE CSV
async function createCSVFile(jobs) {
  if (jobs.length > 0) {
    // Delete old CSV file if exists
    if (await fs.pathExists(CSV_PATH)) {
      await fs.remove(CSV_PATH);
      console.log('🗑️ Old CSV file deleted');
    }

    // Transform and write new CSV with ALL fields
    const csvData = transformJobData(jobs);
    await csvWriter.writeRecords(csvData);
    console.log(`✅ Complete CSV file saved with ${jobs.length} jobs and ALL fields`);
    return true;
  }
  return false;
}


// // Routes

// LinkedIn Job Search Endpoint (POST)
app.post("/api/jobs", async (req, res) => {
  try {
    const {
      limit = "30",
      offset = "0",
      location_filter = '"United States" OR "United Kingdom"',
      description_type = 'text',
      remote = 'true',
      advanced_title_filter = '(QA | \'Test Automation\' | \'Web Development\' | \'AI/ML\' | \'UI/UX\')'
    } = req.body;

    const searchParams = {
      limit,
      offset,
      location_filter,
      remote,
      description_type,
      advanced_title_filter,
    };

    const jobs = await fetchJobsFromLinkedIn(searchParams);
    await createCSVFile(jobs);

    res.json({
      success: true,
      jobs: jobs,
      totalJobs: jobs.length,
      searchParams: searchParams,
      csvFile: jobs.length > 0 ? CSV_FILENAME : null,
      message: `Saved ${jobs.length} jobs with complete data to CSV`
    });

  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// NEW GET API - Auto Fetch Jobs and Download CSV
app.get("/api/auto-download-csv", async (req, res) => {
  try {
    console.log("🚀 GET API triggered - Auto fetching jobs and preparing CSV download");

    // Get query parameters or use defaults
    const {
      limit = "30",
      offset = "0",
      location_filter = '"United States" OR "United Kingdom"',
      description_type = 'text',
      remote = 'true',
      advanced_title_filter = '(QA | \'Test Automation\' | \'Web Development\' | \'AI/ML\' | \'UI/UX\')'
    } = req.query;

    const searchParams = {
      limit,
      offset,
      location_filter,
      remote,
      description_type,
      advanced_title_filter,
    };

    // Step 1: Fetch jobs from LinkedIn API
    const jobs = await fetchJobsFromLinkedIn(searchParams);

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found with current search criteria'
      });
    }

    // Step 2: Create CSV file
    const csvCreated = await createCSVFile(jobs);

    if (!csvCreated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create CSV file'
      });
    }

    // Step 3: Send CSV file for download
    if (fs.existsSync(CSV_PATH)) {
      console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
      res.download(CSV_PATH, CSV_FILENAME, (err) => {
        if (err) {
          console.error('❌ Download error:', err);
          res.status(500).json({ 
            success: false, 
            message: 'Error downloading CSV file' 
          });
        } else {
          console.log('✅ CSV file downloaded successfully');
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'CSV file not found after creation' 
      });
    }

  } catch (error) {
    console.error("❌ Error in auto-download:", error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs and create CSV',
      error: error.message
    });
  }
});

// Regular CSV Download Endpoint (downloads existing CSV)
app.get("/api/download-csv", (req, res) => {
  if (fs.existsSync(CSV_PATH)) {
    res.download(CSV_PATH, CSV_FILENAME, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ success: false, message: 'Download failed' });
      }
    });
  } else {
    res.status(404).json({ success: false, message: 'CSV file not found. Use /api/auto-download-csv to fetch and download.' });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    message: "LinkedIn Job Search API is running!",
    endpoints: {
      "POST /api/jobs": "Search jobs and create CSV",
      "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
      "GET /api/download-csv": "Download existing CSV file"
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 POST Jobs: POST http://localhost:${PORT}/api/jobs`);
  console.log(`📥 Auto Download: GET http://localhost:${PORT}/api/auto-download-csv`);
  console.log(`📁 Download CSV: GET http://localhost:${PORT}/api/download-csv`);
  console.log(`📊 CSV will contain ALL ${CSV_HEADERS.length} fields from API`);
});
