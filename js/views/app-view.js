AppView = Backbone.View.extend({
	el: '#todoapp',
	statsTemplate: _.template($('#stats-template').html()),
	events: {
    'keypress #new-todo'    : 'createOnEnter',
    'click #clear-completed': 'clearPending',
    'click #toggle-all'     : 'toggleAllPending'
  },
	initialize: function() {
    this.readFirebase();
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input      = this.$('#new-todo');
    this.$footer     = this.$('#footer');
    this.$main       = this.$('#main');
    this.listenTo(workload, 'add', this.addOne);
    this.listenTo(workload, 'reset', this.addAll);
    this.listenTo(workload, 'change:pending', this.filterOne);
    this.listenTo(workload, 'filter', this.filterAll);
    this.listenTo(workload, 'all', this.render);
    workload.fetch();
  },
  render: function() {
    var pending = workload.pending().length;
    var remaining = workload.remaining().length;

    if (workload.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        pending: pending,
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
  addOne: function(task) {
    var view = new TaskView({model: task});
    $('#todo-list').prepend(view.render().el);
  },
  addAll: function() {
    this.$('#todo-list').html('');
    workload.each(this.addOne, this);
  },
  filterOne : function(task) {
    task.trigger('visible');
  },
  filterAll : function () {
    workload.each(this.filterOne, this);
  },
	newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: workload.nextOrder(),
      pending: false
    };
  },
  createOnEnter: function(e) {
    if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }
    workload.create( this.newAttributes() );
    this.$input.val('');
  },
  clearPending: function() {
    _.invoke(workload.pending(), 'destroy');
    return false;
  },
	toggleAllPending: function() {
    var pending = this.allCheckbox.checked;

    workload.each(function(task) {
      task.save({'pending': pending});
    });
  }

});






