var AuthForm = Backbone.View.extend({
	el: '#auth-form',
	template: _.template($('#login-form-template').html()),
	template: _.template($('#signup-form-template').html()),
	initialize: function() {
		this.renderLogin();
	},
	events: {
		'click .close' : 'exit'
	},
	renderLogin: function() {
		this.$el.html(this.template());
		return this;
		console.log('we rendered!');
	},
	login: function(e) {
		e.preventDefault();
	},
	exit: function() {
		$('#login-form').fadeOut('fast', function() {
			$('#login-form').remove();
		});
	},
});