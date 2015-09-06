var RB = RB || {};

RB.LANDING = {
  init() {
    $(document).on('click', '.facebook-container', function() {
      RB.LANDING.connectFacebook();
    });
  },

  connectFacebook() {
    // $.ajax({
    //   type: 'GET',
    //   url: '/auth/facebook',
    //   success(data) {

    //   },
    //   error(err) {
    //     console.log(err);
    //   }
    // });
  }
};

$(document).on('ready', function() {
  RB.LANDING.init();
});