var Workload = Backbone.Firebase.Collection.extend({
	model: Task,
	url: 'https://ramenbuffet.firebaseio.com/todos',
  autoSync: true,
	completed: function() {
    return this.filter(function(task) {
      return task.get('completed');
    });
  },
	remaining: function() {
    return this.without.apply( this, this.completed() );
  },
	nextOrder: function() {
    if (!this.length) {
      return 1;
    }
    return this.last().get('order') + 1;
  },
	comparator: function(task) {
    return task.get('order');
  }
});

workload = new Workload();
