RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),

  initalize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
    this.render();
  },

  events: {
    'click .edit .fa-trash'        : 'destroyNote',
    'click .edit .fa-check-square' : 'toggleDone',
    'click .note-text'             : 'positionCursor',
    'blur .note-text'              : ''
  },

  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  },

  positionCursor: function(e) {
    var $input = $(e.currentTarget);
    var range = $input.val().length;

    if ($input.hasClass('busy')) {
      return false;
    }
    else {
      $input.addClass('busy');
      $input[0].setSelectionRange(range, range + 1);
    }

  },

  destroyNote: function() {
    this.destroy(this.model);
    this.remove();
  },

  toggleDone: function() {
    var isDone = this.model.get('done');
    var attributes = {done: !isDone};
    console.log(this.model);
    this.put(this.model, attributes, this);
  },

});