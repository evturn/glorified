var ENTER_KEY = 13;
var FIREBASE_URL  = new Firebase('https://ramenbuffet.firebaseio.com/');
var firebaseCollection = new Firebase(FIREBASE_URL + 'tasks');
var firebaseUsers = new Firebase(FIREBASE_URL + 'users');

var query = firebaseCollection.orderByChild("timestamp").limitToLast(100);
query.on("child_added", function(messageSnapshot) {
  // This will only be called for the last 100 messages
  var messageData = messageSnapshot.val();
  // console.log('Task' + messageData);
});


$(function() {
	moment().format();

	new AppView();

	var ten = 600;
	var twentyFive = 1500;
	var fourtyFive = 2700;
	var sixty = 3600;


	var clock = $('.clock').FlipClock(twentyFive, {
		autoStart: false,
		clockFace: 'MinuteCounter'
	});


		$('#start').on('click', function() {
			clock.start();
			clock.setCountdown(true);
		});
		$('#pause').on('click', function() {
			clock.stop();
		});

	$('#clock').hide();

});