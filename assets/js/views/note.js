RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),

  initalize: function() {
    this.render();
  },

  events: {
    'click .edit .fa-trash' : 'destroyNote',
    'click .edit .fa-check' : 'toggleDone'
  },

  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  },

  destroyNote: function() {
    RB.destroy(this.model);
  },

  toggleDone: function() {
    var note = this.model;
    var isDone = note.get('done');

    if (isDone) {
      note.set({done: false});
      note.save();
    }
    else {
      note.set({done: true});
      note.save();
    }

    RB.put(note);
  },

});