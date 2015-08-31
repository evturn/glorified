var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var fbConfig = require('../config/passport-facebook');
var localConfig = require('passport-local');
var mongoose = require('mongoose');
var User = require('../models/User');
var bcrypt = require('bcrypt');

exports.get = function(req, res, next) {
  res.json(req.user);
};

exports.checkUsernameAvailabiliy = function(req, res, next) {
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
};