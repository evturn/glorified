var AuthForm = Backbone.View.extend({
	el: '#auth-form',
	loginTemplate: _.template($('#login-form-template').html()),
	registerTemplate: _.template($('#register-form-template').html()),
	events: {
		'click .close' 		: 'exit',
		'click #login' 		: 'login',
		'click #register' : 'register'
	},
	renderLogin: function() {
		this.$el.html(this.loginTemplate());
		return this;
	},
	login: function(e) {
		e.preventDefault();
		console.log('login clicked!');
		userEmail 	 = $('#email').val();
		userPassword = $('#password').val();
		var refUsers = new Firebase(FIREBASE_URL + 'users');
		refUsers.authWithPassword({
			email    : userEmail,
			password : userPassword
		}, function(error, authData) {
			if (error) {
    		console.log("Login Failed!", error);
  		} else {
		    	console.log("Authenticated successfully with payload:", authData);
		    	$('#login-form').fadeOut('slow', function() {
		    		$('#login-form').remove();
		    	});	
  			}
		});
	},
	exit: function() {
		$('.auth-form').fadeOut('fast', function() {
			$('.auth-form').remove();
		});
	},
	renderRegister: function() {
		this.$el.html(this.registerTemplate());
		return this;
		console.log('register rendered!');
	},
});