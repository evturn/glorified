var LoginForm = Backbone.View.extend({
	el: '#auth-form',
	template: _.template($('#login-form-template').html()),
	initialize: function() {
		this.render();
	},
	events: {
		'click .close' : 'exit'
	},
	render: function() {
		this.$el.html(this.template());
		return this;
		console.log('we rendered!');
	},
	exit: function() {
		$('#login-form').fadeOut('fast', function() {
			$('#login-form').remove();
		});
	},
});