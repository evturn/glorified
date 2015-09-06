var passport        = require('passport'),
    FacebookStrategy = require('passport-facebook'),
    authKeys = require('./auth'),
    User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new FacebookStrategy(authKeys.facebook,
  function(accessToken, refreshToken, profile, done) {
    var id = profile.id;
      console.log('START ---------- START');
      console.log(profile);
      console.log('END ---------- END');

      User.findOne({'facebook.id': profile.id}, function(err, user) {
        if (err) {
          console.log('So, ' + err);
          return done({
            message: 'So, ' + err
          });
        }

        if (user) {
          console.log(user);
          return done(null, user);
        }
        else {
          console.log('Facebook found you, but we didn\'t, register now!');
          var attr = profile._json;
          var facebookData = {
            facebook: {
              id        : id,
              email     : attr.email,
              name      : attr.name,
              firstName : attr.first_name, // jshint ignore:line
              lastName  : attr.last_name, // jshint ignore:line
              gender    : attr.gender,
              profile   : attr.link
            }
          };

          return done(null, {
            strategy    : 'facebook',
            registered  : false,
            data        : facebookData,
            message     : 'Hi, ' + attr.name +', please register above.'
          });

          // newUser.save(function(err) {
          //   if (err) {
          //     console.log('Error in Saving user: '+ err);
          //     throw err;
          //   }
          //   console.log('User Registration succesful');
          //   return done(null, newUser);
          // });
        }
      });
    }));
