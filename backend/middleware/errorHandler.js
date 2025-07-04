  
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  if (err.message.includes('LinkedIn API Error')) {
    return res.status(502).json({
      success: false,
      message: 'External API error',
      error: err.message
    });
  }
  
  if (err.message.includes('Validation Error')) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;
