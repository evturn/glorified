var _        = require('underscore');
var Backbone = require('backbone');

var RB = RB || {};

RB.task = new Backbone.Model.extend({});

RB.list = new Backbone.Collection.extend({
  model: RB.task,
});

module.exports = RB;