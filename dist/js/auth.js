'use strict';

var RB = RB || {};

RB.AUTH = {

  usernameValidation: false,

  init: function init() {

    $('.reg-un').on('keyup', function () {
      var username = $('.reg-un').val();

      if (username.length >= 2) {
        RB.AUTH.isUsernameAvailable(username);
      } else {
        $('.reg-message').empty();
        $('.reg-icon').hide();
      }
    });
  },

  isUsernameAvailable: function isUsernameAvailable(username) {
    $.ajax({
      url: '/users/usernames',
      method: 'POST',
      data: { username: username },
      success: function success(data, response) {
        console.log('You got it ', data);
        RB.AUTH.appendMessage(data);
      },
      error: function error(err) {
        console.log('No you don\'t got it ', err);
      }
    });
  },

  appendMessage: function appendMessage(data) {
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

  isValidated: function isValidated() {
    if (RB.AUTH.usernameValidation === true && RB.AUTH.passwordValidation === true) {
      $('.reg-submit .fa').addClass('ready');
    } else {
      $('.reg-submit .fa').removeClass('ready');
    }
  }

};

$(document).on('ready', function () {
  RB.AUTH.init();
});