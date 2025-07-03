const express = require('express');
const router = express.Router();
const { exportToCsv, downloadCsv } = require('../controllers/csvExportController');

router.post('/export', exportToCsv);
router.get('/download', downloadCsv);

module.exports = router;
