  
// // // // // const express = require('express');
// // // // // const router = express.Router();
// // // // // const jobController = require('../controllers/jobController');

// // // // // router.post('/jobs', jobController.searchJobs);
// // // // // router.get('/auto-download-csv', jobController.autoDownloadCSV);
// // // // // router.get('/health', jobController.healthCheck);

// // // // // module.exports = router;

// // // // const express = require('express');
// // // // const router = express.Router();
// // // // const jobController = require('../controllers/jobController');
// // // // const authMiddleware = require('../middleware/authMiddleware'); // Add this line

// // // // // Public routes
// // // // router.get('/health', jobController.healthCheck);

// // // // // Protected routes - Add authMiddleware
// // // // router.post('/jobs', authMiddleware, jobController.searchJobs);
// // // // router.get('/auto-download-csv', authMiddleware, jobController.autoDownloadCSV);




// // // // // Add this route to your jobRoutes.js
// // // // router.post('/save-jobs', authMiddleware, async (req, res) => {
// // // //   try {
// // // //     const { jobs, userId } = req.body;
    
// // // //     // Here you can save jobs to MongoDB with userId
// // // //     // For now, just return success
// // // //     res.json({
// // // //       success: true,
// // // //       message: `Saved ${jobs.length} jobs for user ${userId}`
// // // //     });
// // // //   } catch (error) {
// // // //     res.status(500).json({
// // // //       success: false,
// // // //       error: error.message
// // // //     });
// // // //   }
// // // // });

// // // // module.exports = router;


// // // const express = require('express');
// // // const router = express.Router();
// // // const jobController = require('../controllers/jobController');
// // // const authMiddleware = require('../middleware/authMiddleware');

// // // // Existing routes
// // // router.get('/health', jobController.healthCheck);
// // // router.post('/jobs', authMiddleware, jobController.searchJobs);
// // // router.get('/auto-download-csv', authMiddleware, jobController.autoDownloadCSV);

// // // // New database routes
// // // router.post('/save-jobs', authMiddleware, jobController.saveJobsToDatabase);
// // // router.get('/saved-jobs', authMiddleware, jobController.getSavedJobs);

// // // module.exports = router;
// // const express = require('express');
// // const router = express.Router();
// // const jobController = require('../controllers/jobController');
// // const authMiddleware = require('../middleware/authMiddleware');

// // // Public routes
// // router.get('/health', jobController.healthCheck);

// // // Protected routes
// // router.post('/jobs', jobController.searchJobs);
// // router.get('/auto-download-csv', jobController.autoDownloadCSV);
// // // // New database routes
// // // router.post('/save-jobs', jobController.saveJobsToDatabase);
// // // router.get('/saved-jobs',  jobController.getSavedJobs);
// // router.post('/save-jobs',  async (req, res) => {
// //   try {
// //     const { jobs, userId } = req.body;
    
// //     if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'No jobs provided'
// //       });
// //     }

// //     if (!userId) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User ID is required'
// //       });
// //     }

// //     // Use the saveJobsToDatabase method from jobController
// //     const savedJobs = await jobController.saveJobsToDatabase(jobs, userId);
    
// //     res.json({
// //       success: true,
// //       message: `Successfully saved ${savedJobs.length} jobs`,
// //       savedCount: savedJobs.length,
// //       totalJobs: jobs.length
// //     });

// //   } catch (error) {
// //     console.error('❌ Save jobs route error:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Failed to save jobs',
// //       error: error.message
// //     });
// //   }
// // });
// // // Database routes
// // // router.get('/saved-jobs',  jobController.getSavedJobs);
// // // router.delete('/saved-jobs/:jobId', jobController.deleteSavedJob);
// // // router.delete('/saved-jobs',  jobController.clearAllSavedJobs);
// // // router.put('/saved-jobs/:jobId/bookmark',jobController.toggleBookmark);
// // // router.put('/saved-jobs/:jobId/applied',  jobController.markAsApplied);

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const jobController = require('../controllers/jobController');
// const path = require('path');
// const fs = require('fs');

// // All routes are now public (no auth middleware)
// router.get('/health', jobController.healthCheck);
// router.post('/jobs', jobController.searchJobs);
// router.get('/auto-download-csv', jobController.autoDownloadCSV);

// // Database routes (no auth required)
// router.post('/save-jobs', jobController.saveJobs);
// router.get('/saved-jobs', jobController.getSavedJobs); // userId as query param
// router.delete('/saved-jobs/:jobId', jobController.deleteSavedJob); // userId in body
// router.delete('/saved-jobs', jobController.clearAllSavedJobs); // userId in body
// router.put('/saved-jobs/:jobId/bookmark', jobController.toggleBookmark); // userId in body
// router.put('/saved-jobs/:jobId/applied', jobController.markAsApplied); // userId in body
// router.get('/job-stats', jobController.getJobStats); // userId as query param

// // Add this route to download the 20-fields CSV
// // router.get('/download-20-fields-csv', (req, res) => {
// //   const csvPath = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
  
// //   if (fs.existsSync(csvPath)) {
// //     res.download(csvPath, 'linkedin_jobs_20_fields.csv', (err) => {
// //       if (err) {
// //         console.error('Download error:', err);
// //         res.status(500).json({ success: false, message: 'Download failed' });
// //       }
// //     });
// //   } else {
// //     res.status(404).json({ 
// //       success: false, 
// //       message: '20-fields CSV file not found. Search jobs first.' 
// //     });
// //   }
// // });
// router.get('/download-20-fields-csv', (req, res) => {
//   try {
//     const csvPath = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
    
//     console.log('📥 Download 20-fields CSV request');
//     console.log('CSV path:', csvPath);
//     console.log('File exists:', fs.existsSync(csvPath));
    
//     if (fs.existsSync(csvPath)) {
//       res.download(csvPath, 'linkedin_jobs_20_fields.csv', (err) => {
//         if (err) {
//           console.error('❌ Download error:', err);
//           res.status(500).json({ 
//             success: false, 
//             message: 'Download failed',
//             error: err.message 
//           });
//         } else {
//           console.log('✅ 20-fields CSV downloaded successfully');
//         }
//       });
//     } else {
//       console.log('❌ 20-fields CSV file not found');
//       res.status(404).json({ 
//         success: false, 
//         message: '20-fields CSV file not found. Search jobs first to generate the file.' 
//       });
//     }
//   } catch (error) {
//     console.error('❌ Download route error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during download',
//       error: error.message
//     });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

// Public routes (no auth required)
router.get('/health', jobController.healthCheck);
router.post('/jobs', jobController.searchJobs);
router.get('/auto-download-csv2', jobController.autoDownloadCSV2);
router.get('/dummy-jobs', jobController.getDummyJobs);

// Download 20-fields CSV route
router.get('/download-20-fields-csv', (req, res) => {
  try {
    const csvPath = path.join(__dirname, '../', 'linkedin_jobs_20_fields.csv');
    
    console.log('📥 Download 20-fields CSV request');
    console.log('CSV path:', csvPath);
    console.log('File exists:', fs.existsSync(csvPath));
    
    if (fs.existsSync(csvPath)) {
      console.log('✅ CSV file found, starting download');
      res.download(csvPath, 'linkedin_jobs_20_fields.csv', (err) => {
        if (err) {
          console.error('❌ Download error:', err);
          if (!res.headersSent) {
            res.status(500).json({ 
              success: false, 
              message: 'Download failed',
              error: err.message 
            });
          }
        } else {
          console.log('✅ 20-fields CSV downloaded successfully');
        }
      });
    } else {
      console.log('❌ 20-fields CSV file not found');
      res.status(404).json({ 
        success: false, 
        message: '20-fields CSV file not found. Search jobs first to generate the file.' 
      });
    }
  } catch (error) {
    console.error('❌ Download route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during download',
      error: error.message
    });
  }
});

// Protected routes (require authentication)
router.get('/saved-jobs', authMiddleware, jobController.getSavedJobs);
router.delete('/saved-jobs/:jobId', authMiddleware, jobController.deleteSavedJob);
router.delete('/saved-jobs', authMiddleware, jobController.clearAllSavedJobs);
router.put('/saved-jobs/:jobId/bookmark', authMiddleware, jobController.toggleBookmark);
router.put('/saved-jobs/:jobId/applied', authMiddleware, jobController.markAsApplied);
router.get('/job-stats', authMiddleware, jobController.getJobStats);

module.exports = router;
