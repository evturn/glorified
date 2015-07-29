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
    this.destroy(this.model);
    $(document).trigger('listSelected');
    $(document).trigger('listChanged');
    this.remove();
  },

  toggleDone: function() {
    var self = this;
    var isDone = this.model.get('done');
    var id = this.model.get('_id');
    var state;

    if (isDone) {
      state = {done: false};
    }
    else {
      state = {done: true};
    }

    console.log(state.done);
    var done = state.done;

    this.model.save(state, {
      url: '/notes/' + id,
      dataType: 'text',
      data: {
        _id: id,
        done: done
      },
      success: function(model, response) {
        var state = model.get('done');
        console.log('success ', state);
        console.log('reset ', model.get('done'));
        self.render();

      },
      error: function(err) {
        console.log(err);
      },

    });


  },

});