const express = require('express');
const router = express.Router();
const { searchJobs, healthCheck } = require('../controllers/jobController copy');

router.post('/search', searchJobs);
router.get('/health', healthCheck);

module.exports = router;
