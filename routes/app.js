var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var TwitterStrategy = require('passport-twitter');
var fbConfig = require('../config/passport-facebook');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var twitterConfig = require('../config/passport-twitter');
var app = express.Router();

var tempUser = null;


app.get('/', ensureAuthenticated, function(req, res) {
  res.render('app/index', {layout: 'app', user: req.user});
});

app.get('/signup', function(req, res) {
  console.log(tempUser);
  res.render('landing/index', {layout: 'landing', tempUser: tempUser});
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // function will not be called.
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){
    // function will not be called.
});

app.get('/auth/facebook/callback', urlencoded, function(req, res, next) {
  passport.authenticate('facebook', { failureRedirect: '/' }, function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (!user) {
      return res.send({
        success : false,
        message : 'authentication failed'
      });
    }
    else if (user && (user.registered === true)) {
      return res.render({
        success : true,
        message : 'authentication succeeded'
      });
    }
    else if (user && (user.registered === false)) {
      tempUser = user;
      return res.redirect('/signup');
    }
    })(req, res, next);
});

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('landing/index', {layout: 'landing'});
}

module.exports = app;