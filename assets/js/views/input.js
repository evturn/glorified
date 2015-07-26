RB.Input = Backbone.View.extend({

  el: '.active-list-container',

  inputTemplate: _.template($('#input-template').html()),

  initialize: function() {
    this.render();
    console.log('we initing');
  },

  events: {
    'click .create-note-btn'   : 'createNote',
    'keyup .note-input'        : 'createOnEnter',
    'keyup .active-input'      : 'validate',
    'click .garbage-container' : 'removeAllDone'
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
    var $body = $('.note-input').val();
    var $list = $('.list-input').val();
    var $check = $('.create-note-btn .fa');

    if ($body.trim() && $list.trim() !== '') {
      $check.addClass('ready');
    }
    else {
      $check.removeClass('ready');
    }

  },

  createNote: function() {
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $body = $noteInput.val();
    var $list = $listInput.val();

    if ($body.trim() && $list.trim() !== '') {
      RB.post();
    }

  },

  removeAllDone: function() {
    var listname = $('.list-input').val();
    var models = RB.collection.where({
      list: listname,
      done: true
    });

    console.log(models.length);

    for (var i = 0; i < models.length; i++) {
      RB.destroy(models[i]);
    }

    var remaining = RB.collection.where({
      list: listname
    });

    console.log(remaining);
    if (remaining) {
      RB.setListValue(listname);

    }
    else {
      $noteInput.val('');
      $listInput.val('').focus();
      $notesContainer.empty();

    }

  },

});