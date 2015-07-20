RB.Input = Backbone.View.extend({

  el: '.active-list-container',

  inputTemplate: _.template($('#input-template').html()),

  initialize: function() {
    this.render();
  },

  events: {
    'click .create-note-btn' : 'createNote',
    'keyup .note-input'      : 'createOnEnter',
    'keyup .active-input'    : 'validate',
    'click .create-list-btn' : 'createList'
  },

  render: function() {
    $('.active-list-container').html(this.inputTemplate());

    return this;
  },

  createOnEnter: function(e) {
    if (e.keyCode === 13) {
      this.createNote();
    }
  },

  validate: function() {
    var body = $('.note-input').val();
    var list = $('.list-input').val();

    if (body.trim() && list.trim() !== '') {
      $('.create-note-btn .fa').addClass('ready');
    }
    else {
      $('.create-note-btn .fa').removeClass('ready');
    }

  },

  createNote: function() {
    var body = $('.note-input').val();
    var list = $('.list-input').val();

    if (body.trim() && list.trim() !== '') {
      RB.post();
      RB.reset(list);

    }

  },

  createList: function() {
    var $notesContainer = $('.active-notes-container');

    $notesContainer.empty();
    RB.reset('');
  },

});