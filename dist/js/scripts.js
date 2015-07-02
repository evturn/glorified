var Note = Backbone.Model.extend({});
var User = Backbone.Model.extend({});
var Notes = Backbone.Collection.extend({
  url: '/notes',
  model: Note,
  initialize: function() {
    var self = this;
    this.fetch({
      success: function(data) {
        console.log('fetch ', data);
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
  },
  lists: function(serverData) {
    var data = serverData || this;
    var a = [];
    for (var i = 0; i < data.models.length; i++) {
      var list = data.models[i].attributes.list;
      if (a.indexOf(list) === -1) {
        a.push(list);
      }
    }
    return a;
  },
  firstList: function() {
    var lists = this.lists();
    console.log(lists[0]);
  },
});

var notes = new Notes();
var ActiveList = Backbone.View.extend({
  el: '.active-list-container',
  initialize: function() {
    
  },
  render: function() {  
    for (var i = 0; i < notes.length; i++) {
      var note = new Note(notes[i]);
      var view = new NoteItem({model: note});
      view.render();
      $('.active-notes').append(view);        
    }
  }
});
var NoteItem = Backbone.View.extend({
  className: '.list-item',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-check' : 'done',
    'click .fa-trash' : 'trash'
  },
	render: function() {
		$('.active-notes').append(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  done: function() {

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
	var list = $('.new-category-input').val();
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