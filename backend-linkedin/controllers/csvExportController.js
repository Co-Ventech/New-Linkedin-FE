const { exportJobsToCSV, getCSVFilePath, getCSVFileName, csvExists } = require('../models/csvExportModel');

const exportToCsv = async (req, res, next) => {
  try {
    const { jobs } = req.body;
    
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No job data provided for export'
      });
    }

    console.log(`📝 Exporting ${jobs.length} jobs to CSV...`);

    const result = await exportJobsToCSV(jobs);
    
    console.log(`✅ Successfully exported ${result.totalExported} jobs to ${result.filename}`);

    res.json({
      success: true,
      message: `Successfully exported ${result.totalExported} jobs to CSV`,
      filename: result.filename,
      totalExported: result.totalExported
    });

  } catch (error) {
    console.error('❌ CSV Export Error:', error);
    next(error);
  }
};

const downloadCsv = (req, res, next) => {
  try {
    if (csvExists()) {
      const filePath = getCSVFilePath();
      const fileName = getCSVFileName();
      
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.error('Download error:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Download failed' 
          });
        }
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'CSV file not found. Please export jobs first.' 
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  exportToCsv,
  downloadCsv
};
