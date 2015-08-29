

_.extend(Backbone.View.prototype, {

  auth: {

    init() {
      app.isUserLocal();

      $('.btn-container .caption a').on('click', function(e) {
        $('.user-registration .inner').addClass('animated fadeOut');
        $('.user-registration').addClass('animated slideOutUp');
      });

      $('.reg-un').on('keyup', function() {
        let username = $('.reg-un').val();

      });

      $('.reg-pw-2').on('keyup', function() {
        app.comparePasswords();
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

    comparePasswords() {
      let pw2 = $('.reg-pw-2').val(),
          pw1 = $('.reg-pw-1').val();

      if (pw2 === pw1) {
        $('.reg-notify .error').hide();
        $('.reg-notify .ready').show();
      }
      else if (pw2 === '') {
        $('.reg-notify .ready').hide();
        $('.reg-notify .error').hide();
      }
      else {
        $('.reg-notify .ready').hide();
        $('.reg-notify .error').show();
      }
    }
});