

const path = require('path');
const fs = require('fs');

// Check if logs directory exists, if not create it
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Format error message for logging
  const errorLog = `[${timestamp}] ERROR: ${err.stack || err.message || 'Unknown error'}\n`;
  
  // Log to console
  console.error(errorLog);
  
  // Log to error file
  fs.appendFile(
    path.join(logsDir, 'error.log'),
    errorLog,
    (err) => {
      if (err) console.error('Error writing to error log:', err);
    }
  );
  
  // Determine if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Set status code
  const statusCode = err.statusCode || 500;
  
  // Send appropriate response based on content type
  if (req.accepts('html')) {
    // Try to send an error HTML page if it exists
    const errorFile = path.join(__dirname, '../views/error.html');
    if (fs.existsSync(errorFile)) {
      res.status(statusCode).sendFile(errorFile);
    } else {
      // Fallback error HTML
      res.status(statusCode).send(`
        <html>
          <head><title>Error</title></head>
          <body>
            <h1>Something went wrong</h1>
            <p>${isProduction ? 'An error occurred' : err.message || 'Unknown error'}</p>
            <a href="/">Go back to homepage</a>
          </body>
        </html>
      `);
    }
  } else if (req.accepts('json')) {
    // JSON error response
    res.status(statusCode).json({
      error: {
        message: isProduction ? 'An error occurred' : (err.message || 'Unknown error'),
        status: statusCode
      }
    });
  } else {
    // Plain text fallback
    res.status(statusCode).send(`Error: ${isProduction ? 'An error occurred' : (err.message || 'Unknown error')}`);
  }
};

module.exports = errorHandler;