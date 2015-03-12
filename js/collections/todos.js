var app = app || {};

var TodoList = Backbone..Firebase.Collection.extend({
	model: app.Todo,
	localStorage: 'https://ramenbuffet.firebaseio.com/todos',
  autoSync: true,
	completed: function() {
    return this.filter(function( todo ) {
      return todo.get('completed');
    });
  },
	remaining: function() {
    return this.without.apply( this, this.completed() );
  },
	nextOrder: function() {
    if ( !this.length ) {
      return 1;
    }
    return this.last().get('order') + 1;
  },
	comparator: function( todo ) {
    return todo.get('order');
  }

});

app.Todos = new TodoList();