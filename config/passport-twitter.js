var passport        = require('passport'),
    TwitterStrategy = require('passport-twitter'),
    authKeys = require('./auth'),
    User = require('../models/User');

passport.use(new TwitterStrategy(authKeys.twitter,
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.findOne({'twitter.id': profile.id}, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }
        else {
          console.log(profile);
          var newUser              = new User();
          newUser.twitter.id       = profile.id;
          newUser.twitter.token    = token;
          newUser.twitter.username = profile.username;
          newUser.twitter.name     = profile.displayName;

          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));