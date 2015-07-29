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
    var id = this.model.get('_id');
    var isDone = this.model.get('done');
    var attributes = {done: !isDone};
    this.model.save(attributes, {
      url: '/notes/' + id,
      success: function(model, response) {
        console.log(model);
        self.render();
      },
      error: function(error) {
        console.log(error);
      }
    });

  },

});