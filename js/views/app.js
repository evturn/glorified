var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#todoapp',
	statsTemplate: _.template($('#stats-template').html()),
	events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },
	initialize: function() {
    // this.$() finds elements relative to this.$el
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
  },
  addOne: function( todo ) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  },
  addAll: function() {
		// 'this' is used inside 'addAll()' to refer to the view 
		// 'listenTo()' set the callback’s context to the view when it created the binding
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  }

});