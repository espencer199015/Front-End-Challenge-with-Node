var debug = require('debug')('frontend-code-challenge');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('./lib/logger');

var users = require('./routes/users');

var app = express();
var log = logger(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  next(err);
});

// Error handling middleware
app.use(function(err, req, res, next) {
  log.error(err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  log.info('Express server listening on http://localhost:%d', server.address().port);
});