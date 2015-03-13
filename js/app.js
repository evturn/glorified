var ENTER_KEY = 13;
var FIREBASE_URL  = new Firebase('https://ramenbuffet.firebaseio.com/');
var firebaseTodos = new Firebase(FIREBASE_URL + 'todos');

$(function() {
	new AppView();
});



