var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#todoapp',
	statsTemplate: _.template($('#stats-template').html()),
	events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  // this.$() finds elements relative to this.$el
	initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
    this.listenTo(app.Todos, 'change:completed', this.filterOne);
    this.listenTo(app.Todos,'filter', this.filterAll);
    this.listenTo(app.Todos, 'all', this.render);
    app.Todos.fetch();
  },
  render: function() {
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if ( app.Todos.length ) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // Adds a single item to the list and creates a view
  // Then appends its element to the <ul>
  addOne: function( todo ) {
    var view = new app.TodoView({ model: todo });
    $('#todo-list').append( view.render().el );
  },

	// 'this' is used inside 'addAll()' to refer to the view 
	// 'listenTo()' set the callback’s context to the view when it created the binding
  addAll: function() {
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  }.
  filterOne : function (todo) {
    todo.trigger('visible');
  },
  filterAll : function () {
    app.Todos.each(this.filterOne, this);
  },

  // Generates the attributes for a new Todo item
	newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },
});






