var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var fbConfig = require('../config/passport-facebook');
var LocalStrategy = require('passport-local').Strategy;
var localConfig = require('../config/passport-local');
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

exports.putUsernameAndPassword = function(req, res, next) {
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
};

exports.updateFacebook = function(req, res, next) {
  var user = req.user;
  var data = req.body;

  user.facebook = req.body.facebook;

  user.save(function(err, data) {
    if (err) {
      console.log(err)
      return err;
    }
    res.send(data);
  });
};

exports.post = function(req, res, next) {
  var username = req.body.username;
  var data = req.body

  User.findOne({username: username}, function(err, user) {
    if (err) {
      res.send(err);
    }
    if (!user) {
      res.json('Unknown user ' + username);
    }
    if (user) {
      var password;

    }
  });
};