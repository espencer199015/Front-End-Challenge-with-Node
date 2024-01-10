var debug = require('debug')('frontend-code-challenge'); // Debug utility for logging
var express = require('express'); // Express framework
var path = require('path'); // Path module for handling file paths
var favicon = require('serve-favicon'); // Favicon middleware
var cookieParser = require('cookie-parser'); // Cookie parsing middleware
var bodyParser = require('body-parser'); // Body parsing middleware
var logger = require('./lib/logger'); // Logger utility

var users = require('./routes/users'); // Import user routes from separate file

var app = express(); // Create an Express application instance
var log = logger(app); // Initialize logger for the app

app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded requests
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// Serve index.html for the root URL
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve signup.html for the /signup route
app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Serve admin.html for the /admin route
app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Use the users route for API endpoints
app.use('/users', users);

// Handle 404 errors
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err); // Pass to the error handler middleware
});

// Error handling middleware
app.use(function(err, req, res, next) {
  log.error(err); // Log the error
  res.status(err.status || 500); // Set the HTTP status
  res.json({
    message: err.message, // Send error message
    error: err // Send error details
  });
});

app.set('port', process.env.PORT || 3000); // Set the port for the app

// Start the server and listen on the specified port
var server = app.listen(app.get('port'), function() {
  log.info('Express server listening on http://localhost:%d', server.address().port);
});