RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),

  initalize: function() {
    this.render();
  },

  events: {
    'click .edit .fa-trash' : 'clear',
    'click .edit .fa-check' : 'done',
  },

  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  },

  clear: function() {
    var list = this.model.get('list');
    RB.destroy(this.model);
    RB.reset(list);
  },

});