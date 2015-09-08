var RB = RB || {};

RB.AUTH = {
  usernameValidation: false,
  passwordValidation: false,
  local    : false,
  twitter  : false,
  facebook : false,

  init() {
    app.isUserLocal();

    $('.btn-container .caption .close').on('click', function(e) {
      console.log('clicking');
      app.togglePrompt();
    });

    $('.reg-un').on('keyup', function() {
      let username = $('.reg-un').val();

      if (username.length >= 2) {
        app.isUsernameAvailable(username);
      }
      else {
        $('.reg-message').empty();
        $('.reg-icon').hide();
      }
    });

    $('.reg-pw-2').on('keyup', function() {
      app.comparePasswords();
    });

    $(document).on('click', 'i.ready', function() {
      app.registerLocalUser();
    });

    $('.user-settings').on('click', function() {
      app.promptUser();
    });

    $('.register-form').on('keyup', function(e) {
      if (e.keyCode === 13 && $('.reg-submit .fa').hasClass('ready')) {
        app.registerLocalUser();
      }
    });

    $(document).on('click', '.user-login', function() {
      app.renderLoginForm();
    });

    $(document).on('click', '.user-register', function() {
      app.renderRegisterForm();
    });

    $(document).on('click', '.log-submit', function() {
      app.findUserAndLogin();
    });
  },

  findUserAndLogin() {
    let username = $('.log-un').val(),
        password = $('.log-pw').val(),
        attributes = {username, password};

    app._user.post(attributes);
  },

  isUserLocal() {
    let username = app.user.get('username'),
        twitter = app.user.get('twitter'),
        facebook = app.user.get('fbId');

    if (username) {
      app.auth.local = true;
    }

    if (twitter) {
      app.auth.twitter = true;
    }

    if (facebook) {
      app.auth.facebook = true;
    }

    if (app.user.attributes.fbId) {
      let attributes = {
        facebook: {
          name        : app.user.attributes.name,
          displayName : app.user.attributes.displayName,
          firstName   : app.user.attributes.firstName,
          lastName    : app.user.attributes.lastName,
          gender      : app.user.attributes.gender,
          profile     : app.user.attributes.fbProfile,
          id          : app.user.attributes.fbId,
          email       : app.user.attributes.email,
        },
      };

    app._user.put(attributes);
    }

    app.buildUserPrompt();
  },

  buildUserPrompt() {
    let local = app.auth.local;

    if (local) {
      return false;
    }
    else {
      app.promptUser();
    }

  },

  promptUser() {
    app.togglePrompt();
  },

  renderLoginForm() {
    $('.form-container').html(app.loginTemplate());
    $('.user-prompt .btn-container').html(app.switchToRegisterTemplate());
  },

  renderRegisterForm() {
    $('.form-container').html(app.registerTemplate());
    $('.user-prompt .btn-container').html(app.switchToLoginTemplate());
  },

  isUsernameAvailable(username) {
    $.ajax({
      url: '/users/usernames',
      method: 'POST',
      data: {username},
      success(data, response) {
        console.log('You got it ', data);
        app.appendMessage(data);
      },
      error(err) {
        console.log('No you don\'t got it ', err);
      }
    });
  },

  registerLocalUser() {
    let user = app.user,
        _id = user.get('_id'),
        username = $('.reg-un').val(),
        password = $('.reg-pw-2').val();

    user.save({username, password}, {
      url: '/users/' + _id,
      success(data, response) {
        console.log(data);
        app.togglePrompt();
      },
      error(err) {
        console.log(err);
        $('.reg-message').html(err.message);
      }
    });

  },

  appendMessage(data) {
    $('.reg-icon').hide();

    switch (data.message) {
      case "Available":
        $('.available').show();
        app.auth.usernameValidation = true;
        break;
      case "Taken":
        $('.taken').show();
        app.auth.usernameValidation = false;
        break;
    }

    app.isValidated();
    $('.reg-message').html(data.message);
  },

  comparePasswords() {
    let pw2 = $('.reg-pw-2').val(),
        pw1 = $('.reg-pw-1').val();

    if (pw2 === pw1) {
      $('.reg-notify .error').hide();
      $('.reg-notify .ready').show();
      app.auth.passwordValidation = true;
    }
    else if (pw2 === '') {
      $('.reg-notify .ready').hide();
      $('.reg-notify .error').hide();
      app.auth.passwordValidation = false;
    }
    else {
      $('.reg-notify .ready').hide();
      $('.reg-notify .error').show();
      app.auth.passwordValidation = false;
    }
    app.isValidated();
  },

  isValidated() {
    if (app.auth.usernameValidation === true && app.auth.passwordValidation === true) {
      $('.reg-submit .fa').addClass('ready');
    }
    else {
      $('.reg-submit .fa').removeClass('ready');
    }
  },

  togglePrompt() {
    $('.user-prompt').removeClass('off');
    $('.user-prompt').toggleClass('on');

    if ($('.user-prompt').hasClass('on')) {
      $('.user-prompt .inner').removeClass('animated fadeOut');
      $('.user-prompt').removeClass('animated slideOutUp');
      $('.user-prompt .inner').addClass('animated fadeIn');
      $('.user-prompt').addClass('animated slideInDown');
    }
    else {
      $('.user-prompt .inner').removeClass('animated fadeIn');
      $('.user-prompt').removeClass('animated slideInDown');
      $('.user-prompt .inner').addClass('animated fadeOut');
      $('.user-prompt').addClass('animated slideOutUp');
    }
  },
};