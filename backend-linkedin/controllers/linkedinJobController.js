const { fetchLinkedInJobs, validateJobSearchParams } = require('../models/linkedinJobModel');

const getLinkedInJobs = async (req, res, next) => {
  try {
    console.log('🔍 LinkedIn Job Search Request:', req.body);

    const searchParams = {
      limit: req.body.limit || 10,
      offset: req.body.offset || 0,
      location_filter: req.body.location_filter || "United Kingdom",
      description_type: req.body.description_type || 'text',
      remote: req.body.remote !== undefined ? req.body.remote : true,
      advanced_title_filter: req.body.advanced_title_filter || "('AI')",
    };


    // Validate parameters
    const validationErrors = validateJobSearchParams(searchParams);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Fetch jobs from LinkedIn API
    const jobData = await fetchLinkedInJobs(searchParams);

    console.log('✅ LinkedIn Jobs Found:', jobData.totalJobs);

    res.json({
      success: true,
      data: jobData,
      searchParams,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ LinkedIn Job Search Error:', error.message);
    next(error);
  }
};

const healthCheck = (req, res) => {
  res.json({ 
    message: 'LinkedIn Job Search API is running!',
    endpoint: 'linkedin-job-search-api.p.rapidapi.com',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getLinkedInJobs,
  healthCheck
};
