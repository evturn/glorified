var Note = Backbone.Model.extend({});

var Notes = Backbone.Model.extend({
  model: Note,
  url: '/notes',
})