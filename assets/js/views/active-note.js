var NoteItem = Backbone.View.extend({
  className: '.list-item',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-check' : 'done',
    'click .fa-trash' : 'trash'
  },
	render: function() {
		$('.active-notes').append(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  done: function() {

  },
});