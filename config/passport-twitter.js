var passport        = require('passport'),
    TwitterStrategy = require('passport-twitter'),
    authKeys = require('./auth'),
    User = require('../models/User');

passport.use(new TwitterStrategy(authKeys.twitter,
  function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.findOne({'twId': profile.id}, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }
        else {
          var newUser           = new User();
          newUser.twId          = profile.id;
          newUser.twToken       = token;
          newUser.twUsername    = profile.username;
          newUser.twdisplayName = profile.displayName;

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
};