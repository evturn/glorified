var mongoose = require('mongoose');

exports.User = function() {
  return new mongoose.Schema({
    email      : {type : String, unique: false},
    name       : {type : String, unique: false},
    lastName   : {type : String, unique: false},
    firstName  : {type : String, unique: false},
    gender     : {type : String, unique: false},
    fbProfile  : {type : String, unique: false},
    password   : {type : String, unique: false},
    fbId       : {type : String, unique: true},
    fbToken    : {type : String},
    fbEmail    : {type : String, unique: false},
    fbName     : {type : String, unique: false},
    notes      : [noteSchema]
  });
};

exports.Note = function() {
  return new mongoose.Schema({
    list       : {type : String},
    position   : {type : Number},
    created    : {type : Date},
    body       : {type : String},
    done       : {type : Boolean, default: false},
    timestamp  : {type: String}
  });
};

var noteSchema = this.Note();