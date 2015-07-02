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