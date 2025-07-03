// const { searchJobs, validateSearchParams } = require("../models/jobModel");

// const searchJobsController = async (req, res, next) => {
//   try {
//     // Set default values
//     const searchParams = {
//       search_term: req.body.search_term || "agentic ai OR mern OR sqa",
//       location: req.body.location || "usa OR india",
//       results_wanted: req.body.results_wanted || 5,
//       site_name: req.body.site_name || ["linkedin"],
//       distance: req.body.distance || 50,
//       job_type: req.body.job_type || "fulltime",
//       is_remote: req.body.is_remote || true, // Default to true, allow false if explicitly sent
//       linkedin_fetch_description: req.body.linkedin_fetch_description ?? true, // Default to true
//       hours_old: req.body.hours_old || 72,
//     };

//     // Validate parameters
//     const validationErrors = validateSearchParams(searchParams);
//     if (validationErrors.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: validationErrors,
//       });
//     }

//     // Call model to fetch jobs
//     const jobData = await searchJobs(searchParams);

//     // Send response
//     res.json({
//       success: true,
//       data: jobData,
//       searchParams,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const healthCheck = (req, res) => {
//   res.json({
//     message: "Job Search API is running!",
//     timestamp: new Date().toISOString(),
//     status: "healthy",
//   });
// };

// module.exports = {
//   searchJobs: searchJobsController,
//   healthCheck,
// };
const { searchLinkedInJobs, validateSearchParams } = require('../models/jobModel');

const searchJobs = async (req, res, next) => {
  try {
    console.log('🔍 Job Search Request:', req.body);

    const searchParams = {
      job_titles: req.body.job_titles || ['Flutter', 'Devops', 'MERN', 'SQA', 'AGENTIC', 'Nodejs', 'React'],
      locations: req.body.locations || ['United States', 'United Kingdom', 'Saudia', 'United Arab Emirates'],
      limit: req.body.limit || 20,
      offset: req.body.offset || 0,
      remote: req.body.remote !== undefined ? req.body.remote : true,
      description_type: req.body.description_type || 'text'
    };

    // Validate parameters
    const validationErrors = validateSearchParams(searchParams);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Call model to fetch jobs using GET method
    const jobData = await searchLinkedInJobs(searchParams);

    console.log('✅ Jobs Found:', jobData?.jobs?.length || 0);

    res.json({
      success: true,
      totalJobs: jobData?.jobs?.length || 0,
      searchParams,
      jobs: jobData?.jobs || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Job Search Error:', error.message);
    next(error);
  }
};

const healthCheck = (req, res) => {
  res.json({ 
    message: 'LinkedIn Job Search API is running!',
    timestamp: new Date().toISOString(),
    method: 'GET - Confirmed from API documentation'
  });
};

module.exports = {
  searchJobs,
  healthCheck
};
