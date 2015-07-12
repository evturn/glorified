var NoteItem = Backbone.View.extend({
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
    $.ajax({
      type: 'DELETE',
      url: 'notes/' + this.model.get('_id'),
      data: note.toJSON(),
      success: function(data) {
        wrapper.collection.remove(note.get('_id'));
        self.remove();
        var message = "Note deleted";
        RAMENBUFFET.e.notify(message);
      },
      error: function(err) {
        self.remove();
        var message = "Error deleting note";
        RAMENBUFFET.e.notify(message);
      }
    });
  },
  put: function(e) {
    var $evt = $(e.currentTarget);
    var note = this.model;

    $.ajax({
      type: 'PUT',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      dataType: 'JSON',
      success: function(data) {
        var message = "Note updated";
        RAMENBUFFET.e.notify(message);
      },
      error: function(err) {
        var message = "Error updating note";
        RAMENBUFFET.e.notify(message);
      }
    });
    if (!this.model.get('done')) {
      $evt.parent().parent().addClass('done');
      note.set({done: true});
    } else {
      $evt.parent().parent().removeClass('done');
      note.set({done: false});
    }
    this.render();
  },
});