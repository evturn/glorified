'use strict';

var RB = RB || {};

RB.LANDING = {
  init: function init() {
    $(document).on('click', '.facebook-container', function () {
      RB.LANDING.connectFacebook();
    });
  },

  connectFacebook: function connectFacebook() {
    // $.ajax({
    //   type: 'GET',
    //   url: '/auth/facebook',
    //   success(data) {

    //   },
    //   error(err) {
    //     console.log(err);
    //   }
    // });
    var user = user || null;
    console.log(user);
  }
};

$(document).on('ready', function () {
  RB.LANDING.init();
});