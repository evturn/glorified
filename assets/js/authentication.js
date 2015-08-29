

_.extend(Backbone.View.prototype, {

  authentication: {

    init() {
      app.isUserLocal();

      $('.btn-container .caption').on('click', function(e) {
        $('.user-registration .inner').addClass('animated fadeOut');
        $('.user-registration').addClass('animated slideOutUp');
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
    }
});