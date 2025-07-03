const { searchJobs, validateSearchParams } = require('../models/jobModel copy');

const searchJobsController = async (req, res, next) => {
  try {
    console.log('🔍 Job Search Request:', req.body);

    const searchParams = {
      job_titles: req.body.job_titles || [],
      locations: req.body.locations || [],
      limit: req.body.limit || 50,
      offset: req.body.offset || 0,
      type_filter: req.body.type_filter || 'FULL_TIME',
      remote: req.body.remote !== undefined ? req.body.remote.toString() : 'true',
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

    // Call model to fetch jobs
    const jobData = await searchJobs(searchParams);

    console.log('✅ Jobs Found:', jobData?.jobs?.length || 0);

    // Send response
    res.json({
      success: true,
      data: jobData,
      searchParams,
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
    status: 'healthy'
  });
};

module.exports = {
  searchJobs: searchJobsController,
  healthCheck
};
