// ===================
// Mobile
// ===================

_.extend(Backbone.View.prototype, {

  mobile: {

    init() {
      app.setMobile();
    }
  },

  isMobile() {
    let device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return device;
  },

  setMobile() {
    let $body = $('body');

    $body.addClass('mobile');
  },

});