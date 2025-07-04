  
// const express = require('express');
// const router = express.Router();
// const jobController = require('../controllers/jobController');

// router.post('/jobs', jobController.searchJobs);
// router.get('/auto-download-csv', jobController.autoDownloadCSV);
// router.get('/health', jobController.healthCheck);

// module.exports = router;

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware'); // Add this line

// Public routes
router.get('/health', jobController.healthCheck);

// Protected routes - Add authMiddleware
router.post('/jobs', authMiddleware, jobController.searchJobs);
router.get('/auto-download-csv', authMiddleware, jobController.autoDownloadCSV);




// Add this route to your jobRoutes.js
router.post('/save-jobs', authMiddleware, async (req, res) => {
  try {
    const { jobs, userId } = req.body;
    
    // Here you can save jobs to MongoDB with userId
    // For now, just return success
    res.json({
      success: true,
      message: `Saved ${jobs.length} jobs for user ${userId}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
