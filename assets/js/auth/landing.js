var RB = RB || {};

RB.AUTH = {

  usernameValidation: false,

  init() {

    $('.reg-un').on('keyup', function() {
      let username = $('.reg-un').val();

      if (username.length >= 2) {
        RB.AUTH.isUsernameAvailable(username);
      }
      else {
        $('.reg-message').empty();
        $('.reg-icon').hide();
      }
    });

  },

  isUsernameAvailable(username) {
    $.ajax({
      url: '/users/usernames',
      method: 'POST',
      data: {username},
      success(data, response) {
        console.log('You got it ', data);
        RB.AUTH.appendMessage(data);
      },
      error(err) {
        console.log('No you don\'t got it ', err);
      }
    });
  },

  appendMessage(data) {
    $('.reg-icon').hide();

    switch (data.message) {
      case "Available":
        $('.available').show();
        RB.AUTH.usernameValidation = true;
        break;
      case "Taken":
        $('.taken').show();
        RB.AUTH.usernameValidation = false;
        break;
    }

    RB.AUTH.isValidated();
    $('.reg-message').html(data.message);
  },

  isValidated() {
    if (RB.AUTH.usernameValidation === true && RB.AUTH.passwordValidation === true) {
      $('.reg-submit .fa').addClass('ready');
    }
    else {
      $('.reg-submit .fa').removeClass('ready');
    }
  },

};

$(document).on('ready', function() {
  RB.AUTH.init();
});