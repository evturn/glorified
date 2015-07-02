var NoteItem = Backbone.View.extend({
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
	render: function() {
		$('.active-notes').append(this.itemTemplate(this.model.toJSON()));
		return this;
	},
});