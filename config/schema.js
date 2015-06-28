var mongoose = require('mongoose');

exports.User = function() {
  return new mongoose.Schema({
      username   : {type : String, unique: true},
      email      : {type : String, unique: true},
      name       : {type : String},
      lastName   : {type : String},
      firstName  : {type : String},
      gender     : {type : String},
      fbProfile  : {type : String},
      password   : {type : String},
      fbId       : {type : String},
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
    created    : {type : Date, default: Date.now},
    body       : {type : String}
  });
};

var noteSchema = this.Note();