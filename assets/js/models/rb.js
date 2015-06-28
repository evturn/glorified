var $        = require('jquery');
var _        = require('underscore');
var Backbone = require('backbone');

var RB = RB || {};

RB.note = new Backbone.Model.extend({});

RB.list = new Backbone.Collection.extend({
  model: RB.note,
  url: '/notes'
});


module.exports = RB;