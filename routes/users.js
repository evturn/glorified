var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var fbConfig = require('../config/passport-facebook');
var localConfig = require('passport-local');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var User = require('../models/User');


var users = express.Router();

users.get('/', ensureAuthenticated, function(req, res, next) {
  res.json(req.user);
});

users.post('/usernames', ensureAuthenticated, urlencoded, function(req, res, next) {
  User.findByUsername(req.body.username, function(err, user) {
    if (err) {
      console.log(err);
    }
    else if (user === null) {
      res.json({message: 'Available'});
    }
    else if (user) {
      res.json({message: 'Taken'});
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('landing/index', {layout: 'landing'});
}

module.exports = users;