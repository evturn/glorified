Task = Backbone.Model.extend({
  defaults: {
    title: '',
    pending: false
  },
	toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }

});