var NoteItem = Backbone.View.extend({
  el: '.list-item',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-check' : 'done'
  },
	render: function() {
		$('.active-notes').append(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  done: function(e) {
    var target = $(e.currentTarget);
    console.log('clicking ', this.model);
    console.log('target ', target);
    this.model.set({done: true});
  },
});