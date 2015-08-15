var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var bcrypt = require('bcrypt');

var NoteSchema = new mongoose.Schema({
    list       : {type : String},
    created    : {type : Date},
    body       : {type : String},
    done       : {type : Boolean, default: false},
    timestamp  : {type : String}
});

var ListSchema = new mongoose.Schema({
  name: String,
  notes: [NoteSchema],
  created: {
    type: Date,
    default: Date.now
    },
});

var UserSchema = new mongoose.Schema({
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
    lists      : [ListSchema]
});

UserSchema.pre('save', function(next) {
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
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema);