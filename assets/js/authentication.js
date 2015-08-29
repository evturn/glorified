

_.extend(Backbone.View.prototype, {

  authentication: {

    init() {
      app.authentication.isUserLocal();
    },

    isUserLocal(user) {
      let username = app.user.get('username');

      if (!username) {
        app.authentication.promptUser();
      }
    },

    promptUser() {
      app.$el.prepend(app.registerTemplate());

      return this;
    }
  }
});