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
	var category = $('.new-category-input').val();
	$('.kurt-loader').html('<img src="img/dog.gif">');
	$.ajax({
		url: '/notes',
		type: 'POST',
		dataType: 'json',
		data: {
			body: body,
			category: category
		},
		success: function(data) {
			$('.new-note-input').val('');
			$('.new-category-input').val('');
			console.log(data);
			var body = data.body;
			var category = data.category;
			var created = data.created;
			var position = data.position;
			var id = data._id;
			var note = new Note(data);
			var view = new NoteItem({model: note});
			view.render();
			$('.active-notes').append(view);
			$('.kurt-loader').empty();
		},
		error: function(err) {
			$('.kurt-loader').empty();
			$('.kurt-loader').append('<p>We got ', error);
		},
	});
}