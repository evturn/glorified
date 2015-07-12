var mongoose = require('mongoose');

exports.User = function() {
  return new mongoose.Schema({
    username   : {type : String},
    email      : {type : String},
    name       : {type : String},
    lastName   : {type : String},
    firstName  : {type : String},
    gender     : {type : String},
    fbProfile  : {type : String},
    password   : {type : String},
    fbId       : {type : String, unique: true},
    fbToken    : {type : String},
    fbEmail    : {type : String},
    fbName     : {type : String},
    twId       : {type : String},
    twToken    : {type : String},
    twEmail    : {type : String},
    twName     : {type : String},
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