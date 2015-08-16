var RB = {};

RB.User = Backbone.Model.extend({
  url: '/users',
  idAttribute: '_id',
});

RB.Note = Backbone.Model.extend({
  idAttribute: '_id',
});

RB.List = Backbone.Collection.extend({
  idAttribute: '_id',
  model: RB.Notes,
  url: '/notes',
});


// Should be converted to User?
RB.Notes = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
  merge: true,
});
