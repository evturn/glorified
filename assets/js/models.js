var RB = {};

RB.User = Backbone.Model.extend({
  url: '/users',
  idAttribute: '_id',
});

RB.Note = Backbone.Model.extend({
  idAttribute: '_id',
});

RB.List = Backbone.Model.extend({
  idAttribute: '_id',
});

RB.Lists = Backbone.Collection.extend({
  model: RB.List,
  url: '/notes',
});

// Should be converted to User?
RB.Notes = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
  merge: true,
});
