

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
// const csvRoutes = require('./routes/csvRoutes');

app.use('/api', authRoutes);  // Your existing auth routes
app.use('/api', jobRoutes);   // Job search routes  
// app.use('/api', csvRoutes);   // CSV download routes

// Error handling
app.use(errorHandler);

// Global error handler (must be after all routes)
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal Server Error'
    });
  });



module.exports = app;
