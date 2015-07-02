function colorGenerator() {
  var colors = ['red', 'blue', 'green', 'yellow', 'purple', 'grey', 'black', 'orange', 'brown'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

$('.landing-header').on('click', function() {
  $('.landing-header a').css('color', colorGenerator());
});


$(function() {

	$(document).on('click', '.new-note-btn', function(e) {
		e.preventDefault();
		createNote();
	});

});


function createNote() {
	var body = $('.new-note-input').val();
	var list = $('.new-list-input').val();
	$('.kurt-loader').html('<img src="img/dog.gif">');
	$.ajax({
		url: '/notes',
		type: 'POST',
		dataType: 'json',
		data: {
			body: body,
			list: list
		},
		success: function(data) {
			$('.new-note-input').val('');
			$('.new-list-input').val('');
			console.log(data);
			var note = new Note(data);
			var view = new NoteItem({model: note});
			view.render();
			$('.active-notes').append(view);
			$('.kurt-loader').fadeOut('fast', function() {
        $('.kurt-loader').empty();
      });
		},
		error: function(err) {
			$('.kurt-loader').empty();
			$('.kurt-loader').append('<p>We got ', error);
		},
	});
}