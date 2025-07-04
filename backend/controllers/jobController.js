  
const jobModel = require('../models/jobModel');
const csvService = require('../services/csvService');

class JobController {
  async searchJobs(req, res, next) {
    try {
      const searchParams = req.body;
      
      const jobs = await jobModel.searchJobs(searchParams);
      await csvService.createCSVFile(jobs);

      res.json({
        success: true,
        jobs: jobs,
        totalJobs: jobs.length,
        searchParams: searchParams,
        csvFile: jobs.length > 0 ? csvService.getCSVFilename() : null,
        message: `Saved ${jobs.length} jobs with complete data to CSV`
      });

    } catch (error) {
      next(error);
    }
  }

  async autoDownloadCSV(req, res, next) {
    try {
      console.log("🚀 GET API triggered - Auto fetching jobs and preparing CSV download");

      const searchParams = req.query;
      
      // Step 1: Fetch jobs
      const jobs = await jobModel.searchJobs(searchParams);

      if (jobs.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No jobs found with current search criteria'
        });
      }

      // Step 2: Create CSV file
      const csvCreated = await csvService.createCSVFile(jobs);

      if (!csvCreated) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create CSV file'
        });
      }

      // Step 3: Send CSV file for download
      if (csvService.csvExists()) {
        console.log(`📥 Sending CSV file with ${jobs.length} jobs for download`);
        res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
          if (err) {
            console.error('❌ Download error:', err);
            next(err);
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
      next(error);
    }
  }

  healthCheck(req, res) {
    res.json({ 
      message: "LinkedIn Job Search API is running!",
      endpoints: {
        "POST /api/jobs": "Search jobs and create CSV",
        "GET /api/auto-download-csv": "Auto fetch jobs and download CSV",
        "GET /api/download-csv": "Download existing CSV file"
      }
    });
  }
}

module.exports = new JobController();
