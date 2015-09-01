var passport        = require('passport'),
    TwitterStrategy = require('passport-twitter'),
    authKeys = require('./auth'),
    User = require('../models/User');


passport.use(new TwitterStrategy(authKeys.twitter,
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    process.nextTick(function() {
      User.findOne({'twitter.id': profile.id}, function(err, user) {
        if (err) {
          return done(err);
        }

        if (user) {
          return done(null, user);
        }
        else {
          var newUser              = new User();
          var json = profile._json;
          newUser.twitter.id       = json.id;
          newUser.twitter.token    = token;
          newUser.twitter.username = json.screen_name;
          newUser.twitter.name     = json.name;
          newUser.twitter.avatar   = json.profile_image_url;
          newUser.twitter.location = json.location;

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