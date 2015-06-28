var RB = RB || {};

RB.note = new Backbone.Model.extend({});

List = new Backbone.Collection.extend({
  model: RB.note,
  url: '/notes'
});