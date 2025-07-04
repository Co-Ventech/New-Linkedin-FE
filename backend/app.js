  
// const express = require('express');
// const cors = require('cors');
// const errorHandler = require('./middleware/errorHandler');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// const authRoutes = require('./routes/authRoutes');
// const jobRoutes = require('./routes/jobRoutes');
// const csvRoutes = require('./routes/csvRoutes');

// app.use('/api', authRoutes);
// app.use('/api', jobRoutes);
// app.use('/api', csvRoutes);

// // Error handling
// app.use(errorHandler);

// module.exports = app;


const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - Add all three route files
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const csvRoutes = require('./routes/csvRoutes');

app.use('/api', authRoutes);  // Your existing auth routes
app.use('/api', jobRoutes);   // Job search routes  
app.use('/api', csvRoutes);   // CSV download routes

// Error handling
app.use(errorHandler);

module.exports = app;
