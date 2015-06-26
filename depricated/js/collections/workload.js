var Workload = Backbone.Firebase.Collection.extend({
	model: Task,
	url: 'https://ramenbuffet.firebaseio.com/tasks',
  autoSync: true,
	pending: function() {
    return this.filter(function(task) {
      return task.get('pending');
    });
  },
	remaining: function() {
    return this.without.apply(this, this.pending() );
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
