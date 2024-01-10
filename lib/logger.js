// Import required modules: Winston for logging, Express-Winston for Express middleware
var winston = require('winston');
var expressWinston = require('express-winston');

/*
 *  Setup logging for the application
 *  returns a logging instance
 */

// Create a Winston Console transport configuration for logging to the console
var transport = new winston.transports.Console({
  json: false,      // Log messages in a human-readable format (not JSON)
  colorize: true    // Colorize log output for better readability
});

// Define the 'api' function to initialize and configure logging for an Express app
var api = module.exports = function init (app) {
  if (app) {
    // Attach middleware for error logging to the Express app
    app.use(expressWinston.errorLogger({
      transports: [
        transport    // Use the configured Console transport for error logs
      ]
    }));

    // Attach middleware for regular HTTP request logging to the Express app
    app.use(expressWinston.logger({
      transports: [
        transport    // Use the configured Console transport for request logs
      ],
      meta: false,                   // Exclude metadata in log output
      msg: "HTTP {{req.method}} {{req.url}}",   // Define log message format
      expressFormat: true,           // Use Express format for log messages
      colorStatus: true              // Colorize HTTP status codes in logs
    }));
  }

  // Create a new instance of a Winston Logger
  var logger = new (winston.Logger)({
    transports: [
      transport    // Use the configured Console transport for the logger instance
    ]
  });
  return logger;  // Return the configured logger instance
};