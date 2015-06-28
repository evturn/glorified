var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');
var WOW      = require('./lib/wow');
var RB = RB || {};

RB.appView = require('./views/app-view');



function colorGenerator() {
  var colors = ['red', 'blue', 'green', 'yellow', 'purple', 'grey', 'black', 'orange', 'brown'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

$('.landing-header').on('click', function() {
  $('.landing-header a').css('color', colorGenerator());
});

module.exports = RB;