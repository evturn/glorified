RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),
  attributes: {},
  initalize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
  },

  events: {
    'click .edit .fa-trash'        : 'destroyNote',
    'click .edit .fa-check-square' : 'toggleDone',
    'click .note-text'             : 'positionCursor',
    'blur .note-text'              : 'updateNoteBody',
    'keyup .note-text'             : 'updateNoteOnEnter'
  },

  render: function() {
    if (!this.model.get('timestamp')) {
      this.model.set('timestamp', this.convertDate(Date.now()));
    }

    if (!this.model.get('done')) {
      this.model.set('done', false);
    }


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

    this.put(this.model, attributes, this);
  },

  updateNoteBody: function(e) {
    var $input = $(e.currentTarget);
    var content = $input.val().trim();
    var attributes = {body: content};

    $input.removeClass('busy');
    this.put(this.model, attributes, this);
  },

  updateNoteOnEnter: function(e) {
    var $input = $(e.currentTarget);

    if (e.keyCode === 13) {
      $input.blur();
    }
  },

});