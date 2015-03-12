var app = app || {};
var ENTER_KEY = 13;

$(function() {
	new app.AppView();
});


FIREBASE_URL  = new Firebase('https://ramenbuffet.firebaseio.com/');
firebaseTodos = new Firebase(FIREBASE_URL + 'todos');


