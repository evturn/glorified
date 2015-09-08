'use strict';

var RB = RB || {};

RB.AUTH = {

  usernameValidation: false,
  passwordValidation: false,

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

    $('.reg-pw-2').on('keyup', function () {
      RB.AUTH.comparePasswords();
    });

    $('.register-form').on('keyup', function (e) {
      if (e.keyCode === 13 && $('.reg-submit .fa').hasClass('ready')) {
        RB.AUTH.registerLocalUser();
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

  registerLocalUser: function registerLocalUser() {
    var username = $('.reg-un').val(),
        password = $('.reg-pw-2').val(),
        strategy = $('.social-strategy').data('id'),
        $data = $('.social-data'),
        social = strategy.toString(),
        user = {},
        data = {};

    $data.each(function () {
      var key = $(this).attr('data-key'),
          val = $(this).attr('data-' + key),
          attr = key.toString();

      data[attr] = val;
    });

    var jsonSafe = JSON.stringify(data);
    user.username = username;
    user.password = username;
    user.strategy = social;

    switch (social) {
      case 'facebook':
        user.facebook = jsonSafe;
        break;
      case 'twitter':
        user.twitter = jsonSafe;
        break;
    }

    console.log(user);

    $.ajax({
      type: 'POST',
      url: '/users/',
      data: user,
      dataType: 'JSON',
      success: function success(data, response) {
        console.log(data);
        $('.auth-entry').addClass('on');
        $('.message-container').addClass('on');
        $('.auth.btn-container').remove();
        $('.reg-message').remove();
        $('.reg-notify').remove();
        $('.register-form').remove();
        $('.flash-message').remove();
      },
      error: function error(err) {
        console.log(err);
        $('.reg-message').html(err.message);
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
  },

  comparePasswords: function comparePasswords() {
    var pw2 = $('.reg-pw-2').val(),
        pw1 = $('.reg-pw-1').val();

    if (pw2 === pw1) {
      $('.reg-notify .error').hide();
      $('.reg-notify .ready').show();
      RB.AUTH.passwordValidation = true;
    } else if (pw2 === '') {
      $('.reg-notify .ready').hide();
      $('.reg-notify .error').hide();
      RB.AUTH.passwordValidation = false;
    } else {
      $('.reg-notify .ready').hide();
      $('.reg-notify .error').show();
      RB.AUTH.passwordValidation = false;
    }
    RB.AUTH.isValidated();
  }

};

$(document).on('ready', function () {
  RB.AUTH.init();
});