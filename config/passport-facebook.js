var passport        = require('passport'),
    FacebookStrategy = require('passport-facebook');


var User = require('../models/User');

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var url;
if (process.env.NODE_ENV === "development") {
  url = 'http://localhost:3000/auth/facebook/callback';
}
else {
  url = 'http://ramenbuffet.com/auth/facebook/callback';
}

passport.use(new FacebookStrategy({

  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: url


}, function(accessToken, refreshToken, profile, done) {
    var id = profile.id;
    console.log(profile);

      User.findOne({fbId: id}, function(err, user) {
        if (err) {
          console.log('So, ' + err);
          return done({message: 'So, ' + err});
        }
        if (user) {
          console.log(user);
          return done(null, user);
        } else {
          var attr = profile._json;
          var newUser = new User({
            fbId: id,
            email: attr.email,
            name: attr.name,
            firstName: attr.first_name, // jshint ignore:line
            lastName: attr.last_name, // jshint ignore:line
            gender: attr.gender,
            fbProfile: attr.link
          });

          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+ err);
              throw err;
            }
            console.log('User Registration succesful');
            return done(null, newUser);
          });
        }
      });
    }
));