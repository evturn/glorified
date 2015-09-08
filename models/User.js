var User = require('./schema').User(),
    mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    passportLocalMongoose = require('passport-local-mongoose');

User.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10,
    function(err, salt) {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt,
        function(err, hash) {
          if (err) {
            return next(err);
          }

          user.password = hash;
          next(user);
      });
    });
});

User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password,
    function(err, isMatch) {
      if (err) {
        return cb(err);
      }

      cb(null, isMatch);
  });
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);