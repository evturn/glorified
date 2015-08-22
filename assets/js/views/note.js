RB.NoteItem = Backbone.View.extend({

  className: 'note-item',

  itemTemplate: _.template($('#note-item-template').html()),
  attributes: {},
  initalize: function() {
    this.listenTo(this.model, 'destroy', this.remove);
  },

  events: {
    'click .edit .fa-trash'        : 'destroyNote',
    'click .edit .fa-check-square' : 'toggleDone',
    'focus .note-text'             : 'positionCursor',
    'blur .note-text'              : 'updateNoteBody',
    'keyup .note-text'             : 'updateNoteOnEnter'
  },

  render() {
    if (!this.model.get('timestamp') && this.model.get('created')) {
      let created = this.model.get('created');

      this.model.set('timestamp', this.convertDate(created));
    }
    else if (!this.model.get('timestamp') && !this.model.get('created')) {
      this.model.set('timestamp', this.convertDate(new Date()));
    }

    if (!this.model.get('done')) {
      this.model.set('done', false);
    }

    this.$el.html(this.itemTemplate(this.model.toJSON()));
    autosize($('textarea'));
    $('textarea').css({'resize': 'none'});
    return this;
  },

  positionCursor: function(e) {
    var $input = $(e.currentTarget);
    var range = $input.val().length;

    if (!($input.hasClass('busy'))) {
      $input.addClass('busy');
      $input[0].setSelectionRange(range, range + 1);
    }
  },

  destroyNote() {
    if (app.activeListLength === 1) {
      app.list.destroy(this.model, app.activeListId);

      return false;
    }
    else {
      app.destroy(this.model);
      this.remove();
    }

  },

  toggleDone() {
    let isDone = this.model.get('done'),
        listId = this.getActiveListId(),
        attributes = {
          done   : !isDone,
          listId : listId
        };

    app.put(this.model, attributes, this);
  },

  updateNoteBody(e) {
    let $input = $(e.currentTarget),
        content = $input.val().trim(),
        listId = this.getActiveListId(),
        attributes = {
          body   : content,
          listId : listId
        };

    $input.removeClass('busy');
    app.put(this.model, attributes, this);
  },

  updateNoteOnEnter: function(e) {
    var $input = $(e.currentTarget);

    if (e.keyCode === 13) {
      $input.blur();
    }
  },

});