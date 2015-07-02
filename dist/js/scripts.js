var Note = Backbone.Model.extend({});
var NoteItem = Backbone.View.extend({
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
});
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
	console.log(location);
	$.ajax({
		url: '/notes',
		type: 'POST',
		dataType: 'json',
		data: {
			body: body,
			category: category
		},
		success: function(data) {
			console.log(data);
			$('.kurt-loader').empty();
			console.log(data);
			$('.new-note-input').val('');
			$('.new-category-input').val('');
		},
		error: function(err) {
			$('.kurt-loader').empty();
			$('.kurt-loader').append('<p>We got ', error);
		},
	});
}