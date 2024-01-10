var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();

var users = require('../init_data.json').data;
var curId = _.size(users);

/* Create a new user */
router.post('/', function(req, res) {
  var user = req.body;
  user.id = curId++;
  if (!user.state) {
    user.state = 'pending';
  }
  users[user.id] = user;
  log.info('Created user', user);
  res.json(user);
});

router.post('/login', function(req, res) {
  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;

  // Authenticate the user based on the provided credentials
  // Example: Check if the user exists and is activated by the admin
  var user = _.find(users, { email: email, firstName: firstName, lastName: lastName });

  if (user && user.state === 'active') {
    res.json({ loginAllowed: true, userData: user });
  } else {
    res.status(401).json({ loginAllowed: false });
  }
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(_.toArray(users));
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    return next();
  }
  res.json(users[req.params.id]);
});

/* Delete a user by id */
router.delete('/:id', function(req, res) {
  var user = users[req.params.id];
  delete users[req.params.id];
  res.status(204);
  log.info('Deleted user', user);
  res.json(user);
});

/* Update a user by id */
router.put('/:id', function(req, res, next) {
  var userId = req.params.id; // Extract the ID from the request parameters
  var user = users[userId]; // Retrieve the user by ID from the users object

  if (!user) {
    return res.status(404).send('User not found');
  }

  var updatedUser = req.body; // New user data from the request body
  updatedUser.id = userId; // Ensure the ID matches the request parameter ID

  users[userId] = updatedUser; // Update the user object with the new data
  log.info('Updating user', updatedUser);
  res.json(updatedUser);
});

router.put('/:id/status', function(req, res, next) {
  var userId = parseInt(req.params.id);
  var newState = req.body.state;

  var user = users[userId];

  if (!user) {
    return res.status(404).send('User not found');
  }

  user.state = newState;

  log.info(`Updated state of user ${userId} to ${newState}`);
  
  if (newState === 'active') {
    res.json({ message: 'User activated', loginAllowed: true });
  } else {
    res.json({ message: 'User deactivated' });
  }
});

// route for user login authentication
router.post('/login', function(req, res) {
  const { email, firstName, lastName } = req.body;

  // Find the user in your data storage based on email, first name, and last name
  const user = users.find(u => u.email === email && u.firstName === firstName && u.lastName === lastName);

  if (user && user.state === 'active') {
    res.json({ loginAllowed: true });
  } else {
    res.status(401).json({ loginAllowed: false });
  }
});

module.exports = router;