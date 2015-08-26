// ===================
// Mobile
// ===================

_.extend(Backbone.View.prototype, {

  mobile: {

    init() {
      app.setMobile();
    }
  },

  setMobile() {
    let $body = $('body');

    $body.addClass('mobile');
  },

});