var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var fbConfig = require('../config/passport-facebook');
var localConfig = require('passport-local');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var usersCtrl = require('../controllers/users');
var User = require('../models/User');

var users = express.Router();

users.route ('/')
  .get(ensureAuthenticated, usersCtrl.get);

users.route('/usernames')
  .post(ensureAuthenticated, urlencoded, usersCtrl.checkUsernameAvailabiliy);


users.put('/:id', ensureAuthenticated, urlencoded, function(req, res, next) {
  var user = req.user;
  var data = req.body;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(data.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.username = data.username;
      user.password = hash;
      user.save(function(err, data) {
        if (err) {
          console.log(err)
          return err;
        }
        res.send(data);
      });
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('landing/index', {layout: 'landing'});
}

module.exports = users;