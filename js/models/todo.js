var app = app || {};

app.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false,
    important: false,
    urgent: false
  },
	toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }

});