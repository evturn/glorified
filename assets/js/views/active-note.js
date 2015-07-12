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
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + data + '</p>');
        notify();
      },
      error: function(err) {
        self.remove();
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + err + '</p>');
        notify();
      }
    });
  },
  put: function(e) {
    var $evt = $(e.currentTarget);
    var note = this.model;
    if (!this.model.get('done')) {
      $evt.parent().parent().addClass('done');
      note.set({done: true});
    } else {
      $evt.parent().parent().removeClass('done');
      note.set({done: false});
    }
    $.ajax({
      type: 'PUT',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      dataType: 'JSON',
      success: function(data) {
        console.log(data);
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">Note updated</p>');
        notify();
      },
      error: function(err) {
        console.log(err);
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">Note updated</p>');
        notify();
      }
    });
    this.render();
  },
});