var ENTER_KEY = 13;
var FIREBASE_URL  = new Firebase('https://ramenbuffet.firebaseio.com/');
var firebaseCollection = new Firebase(FIREBASE_URL + 'tasks');
var firebaseUsers = new Firebase(FIREBASE_URL + 'users');

var query = firebaseCollection.orderByChild("timestamp").limitToLast(100);
query.on("child_added", function(messageSnapshot) {
  var messageData = messageSnapshot.val();
});


$(function() {
	moment().format();

	new AppView();


	var twentyFive = 1500;
	var clock = $('.clock').FlipClock(twentyFive, {
		autoStart: false,
		clockFace: 'MinuteCounter'
	});

		$('#one-third-hour').on('click', function() {
			clock.setTime(900);
			clock.setCountdown(true);
			clock.start();
		});
		$('#half-hour').on('click', function() {
			clock.setTime(1800);
			clock.setCountdown(true);
			clock.start();
		});
		$('#two-thirds-hour').on('click', function() {
			clock.setTime(2700);
			clock.setCountdown(true);
			clock.start();
		});
		$('#one-hour').on('click', function() {
			clock.setTime(3600);
			clock.setCountdown(true);
			clock.start();
		});

		$('#start').on('click', function() {
			clock.setCountdown(true);
			clock.start();
		});
		$('#pause').on('click', function() {
			clock.stop();
		});

});