var mongoose = require('mongoose');

exports.User = function() {
  return new mongoose.Schema({
    local: {
      username : {type : String, unique: true},
      email    : {type : String, unique: true},
      password : {type : String}
    },
    facebook: {
      id       : {type : String},
      token    : {type : String},
      email    : {type : String},
      name     : {type : String}
    },
    twitter: {
      id       : {type : String},
      token    : {type : String},
      email    : {type : String},
      name     : {type : String}
    },
    notes: [noteSchema]
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