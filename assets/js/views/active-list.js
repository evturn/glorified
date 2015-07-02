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