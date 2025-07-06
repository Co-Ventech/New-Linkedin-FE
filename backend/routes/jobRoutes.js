
// module.exports = router;
const express = require('express');
const router = express.Router();
const { fetchAndSaveJobs, exportJobsCSV } = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// With auth
router.get('/fetch-and-save', authMiddleware, fetchAndSaveJobs);
router.get('/export-csv', authMiddleware, exportJobsCSV);

// Without auth
router.get('/public/fetch-and-save', fetchAndSaveJobs);
router.get('/public/export-csv', exportJobsCSV);

module.exports = router;