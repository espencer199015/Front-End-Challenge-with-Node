var express = require('express');
var router = express.Router();
var _ = require('lodash');
var logger = require('../lib/logger');
var log = logger();

var usersData = require('../init_data.json'); // Import initial user data
var users = usersData.data;
var curId = _.size(users);

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(_.toArray(users));
});

/* Create a new user */
router.post('/', function(req, res) {
  var user = req.body;
  user.id = ++curId; // Increment the ID for the new user
  if (!user.state) {
    user.state = 'pending';
  }
  users[user.id] = user;
  log.info('Created user', user);
  res.status(201).json(user); // Return 201 for successful creation
});

/* Get a specific user by id */
router.get('/:id', function(req, res, next) {
  var user = users[req.params.id];
  if (!user) {
    return next(); // Pass to the error handler middleware for 404
  }
  res.json(user);
});

/* Delete a user by id */
router.delete('/:id', function(req, res) {
  var user = users[req.params.id];
  if (!user) {
    return res.status(404).send('User not found');
  }
  delete users[req.params.id];
  log.info('Deleted user', user);
  res.sendStatus(204); // Send 204 for successful deletion
});

/* Update a user by id */
router.put('/:id', function(req, res, next) {
  var user = req.body;
  if (user.id != req.params.id) {
    return next(new Error('ID parameter does not match body'));
  }
  users[user.id] = user;
  log.info('Updating user', user);
  res.json(user);
});

module.exports = router;