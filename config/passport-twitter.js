var passport        = require('passport'),
    TwitterStrategy = require('passport-twitter'),
    authKeys = require('./credentials'),
    User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new TwitterStrategy(authKeys.twitter,
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    process.nextTick(function() {
      User.findOne({'twitter.id': profile.id}, function(err, user) {
        if (err) {
          console.log('So, ' + err);
          return done({
            message: 'So, ' + err
          });
        }

        if (user) {
          user.registered = true;
          user.token = token;
          return done(null, user);
        }
        else {
          console.log('Twitter found you, but we didn\'t, register now!');
          var attr = profile._json;
          var twitterData = {
            twitter: {
              id       : attr.id,
              token    : token,
              username : attr.screen_name,
              name     : attr.name,
              avatar   : attr.profile_image_url,
              location : attr.location
            }
          };

          return done(null, {
            strategy    : 'twitter',
            registered  : false,
            data        : twitterData,
            message     : 'Hi, ' + attr.name +', please register above.'
          });
        }
      });
    });
  }));