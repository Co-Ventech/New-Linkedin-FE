  
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const CSV_HEADERS = require('./utils/csvHeaders');

// Connect to database
connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 POST Jobs: POST http://localhost:${PORT}/api/jobs`);
  console.log(`📥 Auto Download: GET http://localhost:${PORT}/api/auto-download-csv`);
  console.log(`📁 Download CSV: GET http://localhost:${PORT}/api/download-csv`);
  console.log(`📊 CSV will contain ALL ${CSV_HEADERS.length} fields from API`);
});
