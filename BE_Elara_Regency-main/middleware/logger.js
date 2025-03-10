const fs = require('fs');
const path = require('path');

// Check if logs directory exists, if not create it
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Logger middleware
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${req.method} ${req.url} ${req.ip}\n`;
  
  // Log to console
  console.log(logEntry);
  
  // Log to file
  fs.appendFile(
    path.join(logsDir, 'access.log'),
    logEntry,
    (err) => {
      if (err) console.error('Error writing to log file:', err);
    }
  );
  
  next();
};

module.exports = logger;