AppView = Backbone.View.extend({
	el: '#todoapp',
	statsTemplate: _.template($('#stats-template').html()),
	events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },
	initialize: function() {
    this.readFirebase();
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.listenTo(workload, 'add', this.addOne);
    this.listenTo(workload, 'reset', this.addAll);
    this.listenTo(workload, 'change:completed', this.filterOne);
    this.listenTo(workload,'filter', this.filterAll);
    this.listenTo(workload, 'all', this.render);
    workload.fetch();
  },
  render: function() {
    var completed = workload.completed().length;
    var remaining = workload.remaining().length;

    if (workload.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( TodoFilter || '' ) + '"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },
  readFirebase: function() {
    firebaseCollection.on("value", function(snapshot) {
        console.log('Firebase Collection', snapshot.val());
      }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
  },
  addOne: function( todo ) {
    var view = new TaskView({ model: todo });
    $('#todo-list').prepend( view.render().el );
  },
  addAll: function() {
    this.$('#todo-list').html('');
    workload.each(this.addOne, this);
  },
  filterOne : function (todo) {
    todo.trigger('visible');
  },
  filterAll : function () {
    workload.each(this.filterOne, this);
  },
	newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: workload.nextOrder(),
      completed: false
    };
  },
  createOnEnter: function( event ) {
    if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }
    workload.create( this.newAttributes() );
    this.$input.val('');
  },
  clearCompleted: function() {
    _.invoke(workload.completed(), 'destroy');
    return false;
  },
	toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;
    workload.each(function( todo ) {
      todo.save({
        'completed': completed
      });
    });
  }

});






