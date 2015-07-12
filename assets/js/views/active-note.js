RAMENBUFFET.ActiveNote = Backbone.View.extend({
  className: 'list-item wow fadeIn animated',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-trash' : 'clear',
    'click .fa-check' : 'put'
  },
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  clear: function() {
    var self = this;
    var note = this.model;
    RAMENBUFFET.http.destroy(self, note);
  },
  put: function(e) {
    var $evt = $(e.currentTarget);
    var self = this;
    var note = this.model;
    if (!note.get('done')) {
      $evt.parent().parent().addClass('done');
      note.set({done: true});
    } else {
      $evt.parent().parent().removeClass('done');
      note.set({done: false});
    }
    RAMENBUFFET.http.put(self, note);
    this.render();
  },
});