  
const csvService = require('../services/csvService');

class CSVController {
  downloadCSV(req, res, next) {
    try {
      if (csvService.csvExists()) {
        res.download(csvService.getCSVPath(), csvService.getCSVFilename(), (err) => {
          if (err) {
            console.error('Download error:', err);
            next(err);
          }
        });
      } else {
        res.status(404).json({ 
          success: false, 
          message: 'CSV file not found. Use /api/auto-download-csv to fetch and download.' 
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CSVController();
