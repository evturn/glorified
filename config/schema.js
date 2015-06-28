var mongoose = require('mongoose');

var User = mongoose.Schema({
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
  notes: [Note]
});

var Note = mongoose.Schema({
  list       : {type : String},
  position   : {type : number},
  created    : {type : Date, default: Date.now},
  body       : {type : String}
});