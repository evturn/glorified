var app = app || {};

app.Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false,
    priority: ''
  },
	toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }

});