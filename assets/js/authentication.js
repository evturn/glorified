

_.extend(Backbone.View.prototype, {

  auth: {
    usernameValidation: false,
    passwordValidation: false,

    init() {
      app.isUserLocal();

      $('.btn-container .caption a').on('click', function(e) {
        app.collapseRegistration();
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
    }
  },

    isUserLocal(user) {
      let username = app.user.get('username');

      if (!username) {
        app.promptUser();
      }
    },

    promptUser() {
      let greeting = app.greeting(),
          name = app.user.attributes.firstName;

      $('body').prepend(app.registerTemplate({greeting, name}));

      return this;
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
          app.collapseRegistration();
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

    collapseRegistration() {
      $('.user-registration .inner').addClass('animated fadeOut');
      $('.user-registration').addClass('animated slideOutUp');
    }
});