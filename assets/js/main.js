var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');
var WOW      = require('./lib/wow');

var RB = RB || {};

RB.task = new Backbone.Model.extend({});

RB.list = new Backbone.Collection.extend({
  model: RB.task,
});

$('h1').on('click', function() {
  var colors = ['red', 'blue', 'green', 'yellow', 'purple', 'grey', 'black', 'orange', 'brown'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  $('h1').css('color', color);
});

module.exports = RB;
