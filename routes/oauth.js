var LocalStrategy    = require('passport-local').Strategy;
var credentials      = require('../config/credentials'),
    FacebookStrategy = require('passport-facebook'),
    TwitterStrategy  = require('passport-twitter').Strategy;

//////////////////////
// PASSPORT
//////////////////////

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//////////////////////
// LOCAL
//////////////////////

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({
    username: username
  },
  function(err, user) {
    if (err) {
      return done(err);
    }

    if (user) {
      user.comparePassword(password,
        function(err, isMatch) {
          if (err) {
            console.log(err);
          }

          if (isMatch) {
            return done(null, user);
          }
          else {
            return done(null, false);
          }
      });
    }
  });
}));

var secure = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  }
  else {
    next();
  }
};

//////////////////////
// ROUTES
//////////////////////

app.get('/',
  secure,
  function(req, res, next) {
    console.log('===SECURE==');
    console.log(req.user);
    console.log('===SECURE==');
    res.render('index', {
      layout: 'app',
      user: req.user
    });
  });


app.get('/register',
  function(req, res, next) {
    console.log('==REGISTER=');
    console.log(req.user);
    console.log('==REGISTER=');
    res.render('landing/signup',
      {layout: 'landing'});
  });

app.post('/register',
  function(req, res, next) {
    var user = new User();

    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err, user) {
      if (err) {
        return res.render('landing/signup', {
          layout: 'landing',
          message: 'Username taken.'
        });
      }

      req.login(user,
        function(err) {
          if (err) {
            return next(err);
          }

        passport.authenticate('local')(req, res,
          function() {
            res.redirect('connect');
          });
      });
    });
  });

app.get('/login',
  function(req, res, next) {
    console.log('====LOGIN==');
    console.log(req.user);
    console.log('====LOGIN==');
    res.render('landing/login',
      {layout: 'landing'});
  });

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  function(req, res, next) {
    res.redirect('/');
  });

app.get('/logout',
  function(req, res, next) {
    req.logout();
    res.redirect('login');
  });

app.get('/connect',
  secure,
  function(req, res, next) {
    res.render('landing/connect', {
      layout: 'landing',
      user: req.user
    });
  });

//////////////////////
// FACEBOOK
//////////////////////

passport.use(new FacebookStrategy(credentials.facebook,
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'facebook.id': profile.id
    },
    function(err, user) {
      if (err) {
        return done(null, false, err);
      }

      if (user) {
        user.valid = true;
        return done(null, user);
      }
      else {
        return done(null, profile);
      }
    });

  }));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  urlencoded,
  function(req, res, next) {
    passport.authenticate('facebook', {
      failureRedirect: '/register'
    },
    function(err, user, info) {
      if (err) {
        return next(err);
      }

      if (user && user.valid) {
        req.login(user,
          function(err) {
            if (err) {
              return next(err);
          }

          return res.redirect('/');
        });
      }
      else if (user && req.user) {
        var attr = user._json;

        req.user.facebook = {
          id        : attr.id,
          email     : attr.email,
          name      : attr.name,
          firstName : attr.first_name,
          lastName  : attr.last_name,
          gender    : attr.gender,
          profile   : attr.link,
        };

        req.user.save(function(err, user) {
          if (err) {
            console.log(err);
          }

          return res.redirect('/connect');
        });
      }
      else if (!req.user) {
        return res.redirect('/register');
      }
    })(req, res, next);
});

//////////////////////
// TWITTER
//////////////////////

passport.use(new TwitterStrategy(credentials.twitter,
  function(accessToken, refreshToken, profile, done) {
    User.findOne({
      'twitter.id': profile.id
    },
    function(err, user) {
      if (err) {
        return done(null, false, err);
      }

      if (user) {
        user.valid = true;
        user.token = accessToken;
        return done(null, user);
      }
      else {
        profile.token = accessToken;
        return done(null, profile);
      }
    });
  }));

//////////////////////
// TWITTER ROUTES
//////////////////////

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  urlencoded,
  function(req, res, next) {
    passport.authenticate('twitter', {
      failureRedirect: '/register'
    },
    function(err, user, info) {
      if (err) {
        return next(err);
      }

      if (user && user.valid) {
        req.login(user,
          function(err) {
            if (err) {
              return next(err);
          }

          return res.redirect('/');
        });
      }
      else if (user && req.user) {
        var attr = user._json;

        req.user.twitter = {
          id       : attr.id,
          token    : user.token,
          username : attr.screen_name,
          name     : attr.name,
          avatar   : attr.profile_image_url,
          location : attr.location
        };

        req.user.save(function(err, user) {
          if (err) {
            console.log(err);
          }

          return res.redirect('/connect');
        });
      }
      else if (!req.user) {
        return res.redirect('/register');
      }
    })(req, res, next);
});