var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var TwitterStrategy = require('passport-twitter');
var fbConfig = require('../config/passport-facebook');
var twitterConfig = require('../config/passport-twitter');
var app = express.Router();

app.get('/', ensureAuthenticated, function(req, res) {
  console.log(req.user);
  res.render('app/index', {layout: 'app', user: req.user});
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

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
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