var mongoose = require('mongoose');

exports.User = function() {
  return new mongoose.Schema({
    username   : {type : String, sparse: true},
    email      : {type : String, sparse: true},
    name       : {type : String, sparse: true},
    lastName   : {type : String, sparse: true},
    firstName  : {type : String, sparse: true},
    gender     : {type : String, sparse: true},
    fbProfile  : {type : String, sparse: true},
    password   : {type : String, sparse: true},
    fbId       : {type : String},
    fbToken    : {type : String},
    fbEmail    : {type : String, sparse: true},
    fbName     : {type : String, sparse: true},
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
    timestamp  : {type : String},
    listOrder  : {type : Number}
  });
};

var noteSchema = this.Note();