  
const path = require('path');

const CSV_CONFIG = {
  filename: 'linkedin_jobs_complete.csv',
  path: path.join(__dirname, '../', 'linkedin_jobs_complete.csv'),
  encoding: 'utf8'
};

module.exports = CSV_CONFIG;
