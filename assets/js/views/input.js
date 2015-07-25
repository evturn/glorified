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
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $body = $noteInput.val();
    var $list = $listInput.val();

    if ($body.trim() && $list.trim() !== '') {
      RB.post();
      $noteInput.val('').focus();
    }

  },

  createList: function() {
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $notesContainer = $('.active-notes-container');

    $noteInput.val('');
    $listInput.val('').focus();
    $notesContainer.empty();
  },

});