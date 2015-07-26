RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),

  initalize: function() {
    this.render();
  },

  events: {
    'click .edit .fa-trash'        : 'destroyNote',
    'click .edit .fa-check-square' : 'toggleDone'
  },

  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  },

  destroyNote: function() {
    RB.destroy(this.model);
    $(document).trigger('listSelected');
    $(document).trigger('listChanged');
    this.remove();
  },

  toggleDone: function() {
    var note = this.model;
    var isDone = note.get('done');
    var self = this;
    var parity = !isDone;

    var attr = {done: parity};
    console.log(note);
    note.save(attr, {
      success: function(model, response) {
        $(document).trigger('listSelected');
        $(document).trigger('listChanged');
        RB.collection.set(model);
        self.render({model: model});
        console.log(model, response);
      },
      error: function(err) {
        console.log(err);
      }
    });
  },

});