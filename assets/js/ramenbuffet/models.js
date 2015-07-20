var RB = {};

RB.Note = Backbone.Model.extend({});

RB.Notes = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
});

RB.List = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
});