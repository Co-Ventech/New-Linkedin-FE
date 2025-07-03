const express = require('express');
const router = express.Router();
const { saveJobsCSV, downloadCSV, getCSVStatus } = require('../controllers/csvController');

router.post('/save', saveJobsCSV);
router.get('/download', downloadCSV);
router.get('/status', getCSVStatus);

module.exports = router;
