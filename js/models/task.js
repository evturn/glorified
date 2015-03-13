Task = Backbone.Model.extend({
  defaults: {
    title: '',
    pending: false
  },
	toggle: function() {
    this.save({
      pending: !this.get('pending')
    });
  }

});