var NoteItem = Backbone.View.extend({
  className: '.list-item',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
	render: function() {
    console.log(this.model);
		$('.active-notes').append(this.itemTemplate(this.model.toJSON()));
		return this;
	},
});