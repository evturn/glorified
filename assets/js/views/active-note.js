var NoteItem = Backbone.View.extend({
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-trash' : 'clear'
  },
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  clear: function() {
    var self = this;
    $.ajax({
      type: 'DELETE',
      url: 'notes/' + this.model.get('_id'),
      success: function(data) {
        self.remove();
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + data + '</p>');
        notify();
      },
      error: function(err) {
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + err + '</p>');
        notify();
      }
    });
  },
});