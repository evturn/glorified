var RAMENBUFFET = {};

RAMENBUFFET.Note = Backbone.Model.extend({
  idAttribute: '_id'
});

RAMENBUFFET.Notes = Backbone.Collection.extend({
  url: '/notes',
  model: RAMENBUFFET.Note,
  comparator: 'position'
});
