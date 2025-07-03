const { saveJobsToCSV, checkCSVExists, getCSVPath, getCSVFilename } = require('../models/csvModel');

const saveJobsCSV = async (req, res, next) => {
  try {
    const { jobs } = req.body;
    
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No job data provided or invalid format'
      });
    }

    console.log(`📝 Saving ${jobs.length} jobs to CSV...`);

    const result = await saveJobsToCSV(jobs);
    
    console.log(`✅ Successfully saved ${jobs.length} jobs to ${result.filename}`);

    res.json({
      success: true,
      message: `Successfully saved ${jobs.length} jobs to CSV`,
      filename: result.filename,
      totalJobs: result.totalJobs
    });

  } catch (error) {
    console.error('❌ CSV Save Error:', error);
    next(error);
  }
};

const downloadCSV = (req, res, next) => {
  try {
    if (checkCSVExists()) {
      const csvPath = getCSVPath();
      const filename = getCSVFilename();
      
      res.download(csvPath, filename, (err) => {
        if (err) {
          console.error('Download error:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Download failed' 
          });
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'CSV file not found. Please save jobs first.' 
      });
    }
  } catch (error) {
    next(error);
  }
};

const getCSVStatus = (req, res) => {
  const exists = checkCSVExists();
  res.json({
    success: true,
    csvExists: exists,
    filename: getCSVFilename()
  });
};

module.exports = {
  saveJobsCSV,
  downloadCSV,
  getCSVStatus
};
