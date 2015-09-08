var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt');

var passportLocalMongoose = require('passport-local-mongoose');

var Note = new mongoose.Schema({
    list         : {type : String},
    created      : {type : Date,    default: new Date()},
    body         : {type : String},
    done         : {type : Boolean, default: false},
    timestamp    : {type : String},
    updated      : {type : String}
});


var List = new mongoose.Schema({
    name         : {type : String},
    icon         : {type : String,  default: 'fa fa-tasks'},
    created      : {type : Date,    default: new Date()},
    notes        : [Note],
});

var User = new mongoose.Schema({
    email        : {type : String, sparse: true, unique: true},
    password     : {type : String, sparse: true, required: true},
    username     : {type : String, sparse: true, required: true, unique: true},
    name         : {type : String, sparse: true},
    facebook     : {
      name       : {type : String, sparse: true},
      lastName   : {type : String, sparse: true},
      firstName  : {type : String, sparse: true},
      gender     : {type : String, sparse: true},
      profile    : {type : String, sparse: true},
      id         : {type : String},
      token      : {type : String},
      email      : {type : String, sparse: true}
    },
    twitter      : {
      id         : {type : String},
      token      : {type : String},
      username   : {type : String, sparse: true},
      name       : {type : String, sparse: true},
      location   : {type : String, sparse: true},
      avatar     : {type : String, sparse: true}
    },
    lists        : [List]
});

User.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next(user);
    });
  });
});

User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};


User.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', User);