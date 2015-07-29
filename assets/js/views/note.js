RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),

  initalize: function() {
    this.render();
    this.listenTo(this.model, 'change', this.render);
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
    var isDone = this.model.get('done');
    var attributes = {done: !isDone};
    this.put(this.model, attributes, this);
    var state = this.model.get('done');
    console.log(state);
  },

});