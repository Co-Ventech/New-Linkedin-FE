// const express = require('express');
// const router = express.Router();
// const { searchJobs, healthCheck } = require('../controllers/jobController');

// // Job search routes
// router.post('/search', searchJobs);
// router.get('/health', healthCheck);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { searchJobs, healthCheck } = require('../controllers/jobController');

router.post('/search', searchJobs);
router.get('/health', healthCheck);

module.exports = router;
