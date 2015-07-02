var Note = Backbone.Model.extend({});
var User = Backbone.Model.extend({});
var ActiveList = Backbone.View.extend({
  el: '.active-list-container',
  initialize: function() {
    this.allLists();
  },
  allLists: function() {
    $.ajax({
    url: '/notes',
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      var notes = data.user.notes;
      for (var i = 0; i < notes.length; i++) {
        var note = new Note(notes[i]);
        var view = new NoteItem({model: note});
        view.render();
        $('.active-notes').append(view);        
      }
    },
    error: function(err) {
      $('.kurt-loader').append('<p>We got ', error);
    },
  });

  }
});
var NoteItem = Backbone.View.extend({
  el: '.list-item',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-check' : 'done'
  },
	render: function() {
		$('.active-notes').append(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  done: function(e) {
    var target = $(e.currentTarget);
    console.log('clicking ', this.model);
    console.log('target ', target);
    this.model.set({done: true});
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

var activeList = new ActiveList();

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