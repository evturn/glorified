var Note = Backbone.Model.extend({
  url: '/notes'
});

var App = Backbone.View.extend({
  el: '.app-wrapper',
  initialize: function() {
    console.log('hi');
    this.model = new Note({list: 'Cooking', body: 'Learn to cook or just so something'});
  },
  events: {
    'click .fa-plus' : 'getNotes'
  },
  getNotes: function() {
    console.log('yes');
    this.model.save();
  },
});