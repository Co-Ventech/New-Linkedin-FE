const express = require('express');
const router = express.Router();
const { getLinkedInJobs, healthCheck } = require('../controllers/linkedinJobController');

router.post('/fetch', getLinkedInJobs);
router.get('/health', healthCheck);

module.exports = router;
