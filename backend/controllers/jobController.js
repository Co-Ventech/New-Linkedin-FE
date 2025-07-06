  

const fs = require('fs');
const path = require('path');
const { fetchJobsFromRapidAPI } = require('../services/linkedinService');
const { writeJobsToCSV, mapJobTo20Fields, CSV_PATH } = require('../services/csvService');
const JobBatch = require('../models/jobBatchSchema');

// Fetch from RapidAPI, log, save raw, clean, and save as a new batch in MongoDB
async function fetchAndSaveJobs(req, res) {
  try {
    // Accept query params for flexibility
    const params = {
      limit: req.query.limit || undefined,
      location_filter: req.query.location_filter || undefined,
      advanced_title_filter: req.query.advanced_title_filter || undefined,
      // ...add more as needed
    };
    Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

    const jobs = await fetchJobsFromRapidAPI(params);

    // 1. Log to terminal
    console.log('Raw API response:', JSON.stringify(jobs, null, 2));

    // 2. Ensure data folder exists and save file
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const savePath = path.join(dataDir, 'last_api_response.json');
    await fs.promises.writeFile(savePath, JSON.stringify(jobs, null, 2), 'utf-8');
    console.log(`Raw API response saved to ${savePath}`);

    // 3. Clean/map data
    const cleanedJobs = jobs.map(mapJobTo20Fields);

    // 4. Save as a new batch
    const batch = new JobBatch({ jobs: cleanedJobs });
    await batch.save();

    res.json({
      success: true,
      saved: cleanedJobs.length,
      batchId: batch._id,
      createdAt: batch.createdAt
    });
  } catch (err) {
    console.error('Fetch/Save Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}
// Export the jobs from the most recent batch as CSV
async function exportJobsCSV(req, res) {
  try {
    // Find the most recent batch
    const lastBatch = await JobBatch.findOne().sort({ createdAt: -1 });
    if (!lastBatch || !lastBatch.jobs || lastBatch.jobs.length === 0) {
      return res.status(404).json({ success: false, error: 'No jobs found in the latest batch.' });
    }
    await writeJobsToCSV(lastBatch.jobs);
    res.download(CSV_PATH, 'linkedin_jobs_20_fields.csv');
  } catch (err) {
    console.error('Export CSV Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { fetchAndSaveJobs, exportJobsCSV };