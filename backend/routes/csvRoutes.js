  
// const express = require('express');
// const router = express.Router();
// const csvController = require('../controllers/csvController');

// router.get('/download-csv', csvController.downloadCSV);

// module.exports = router;


const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csvController');
const authMiddleware = require('../middleware/authMiddleware'); // Add this line

// Protected routes - Add authMiddleware
router.get('/download-csv', authMiddleware, csvController.downloadCSV);

module.exports = router;
