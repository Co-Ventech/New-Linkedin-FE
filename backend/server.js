  
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

// Connect to database
connectDB();

const PORT = 3001;

app.listen(PORT, () => {
  console.log('\n================= API Endpoints =================');
console.log(`🚀 Server running on:         http://localhost:${PORT}`);
console.log('-------------------------------------------------');
console.log(`🔑 Register:                 POST   /api/auth/signup`);
console.log(`🔑 Login:                    POST   /api/auth/login`);
console.log('-------------------------------------------------');
console.log(`📡 Fetch & Save Jobs:        GET    /api/jobs/fetch-and-save`);
console.log(`   (with params)             GET    /api/jobs/fetch-and-save?limit=10&location_filter="India"&advanced_title_filter="UI/UX"`);
console.log(`📥 Export Last Batch as CSV: GET    /api/jobs/export-csv`);
console.log('-------------------------------------------------');
console.log(`📁 Raw API data saved at:    /backend/data/last_api_response.json`);
console.log('=================================================\n');
});
