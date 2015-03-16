var ENTER_KEY = 13;
var FIREBASE_URL  = new Firebase('https://ramenbuffet.firebaseio.com/');
var firebaseCollection = new Firebase(FIREBASE_URL + 'todos');

var query = firebaseCollection.orderByChild("timestamp").limitToLast(100);
query.on("child_added", function(messageSnapshot) {
  // This will only be called for the last 100 messages
  var messageData = messageSnapshot.val();
  // console.log('Task' + messageData);
});


$(function() {
	moment().format();

	new AppView();

	$('#login').on('click', function(e) {
		e.preventDefault();
		console.log('login clicked!');
	});

	var clock = new FlipClock($('#clock'), {autoStart: false});
		clock.setTime(1500);
		clock.setCountdown(true);

		$('#clock').on('click', function() {
			clock.start();
		});
});