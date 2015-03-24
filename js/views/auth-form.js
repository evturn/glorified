var AuthForm = Backbone.View.extend({
	el: '#auth-form',
	loginTemplate: _.template($('#login-form-template').html()),
	registerTemplate: _.template($('#register-form-template').html()),
	events: {
		'click .close' 				 : 'exit',
		'click #login' 				 : 'login',
		'click #register' 		 : 'register',
		'keypress .form-login' : 'loginOnEnter'
	},
	renderLogin: function() {
		this.$el.html(this.loginTemplate());
		return this;
	},
	login: function() {
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
  loginOnEnter: function(e) {
	  if ( e.which === ENTER_KEY ) {
	    this.login();
	  }
	},
	register: function(e) {
		e.preventDefault();
		console.log('register clicked!');
		userEmail 	 = $('#email').val();
		userPassword = $('#password').val();
		var ref = new Firebase(FIREBASE_URL + 'users');
		ref.createUser({
  		email    : userEmail,
  		password : userPassword
		}, function(error, userData) {
		  if (error) {
		    console.log("Error creating user:", error);
		  } else {
		    	console.log("Successfully created user account with uid:", userData.uid);
		    	$('#register-form').fadeOut('slow', function() {
		    		$('#register-form').remove();
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