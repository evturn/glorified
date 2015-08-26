RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate       : _.template($('#input-template').html()),
  progressBarTemplate : _.template($('#progress-bar-template').html()),

  user                       : null,
  listsCollection            : null,
  notesCollection            : null,
  activeListId               : null,
  activeListLength           : null,
  mobileClient               : null,
  tabletClient               : null,
  desktopClient              : null,
  windowWidth                : $(window).width(),
  $lists                     : $('.lists'),
  $notes                     : $('.notes'),

  initialize() {
    this.renderForms();
  },

  events: {
    'click .create-list-btn' : 'createList',
    'click .create-note-btn' : 'createNote',
    'keyup .note-input'      : 'createOnEnter',
    'keyup .activeInput'     : 'validate'
  },

  createList() {
    let $noteInput = $('.note-input'),
        $listInput = $('.list-input'),
        $barContainer = $('.active-progress'),
        $notesContainer = $('.notes-container');

    $noteInput.val('');
    $listInput.val('').focus();
    app.activeListId = null;
    $notesContainer.empty();
    $barContainer.empty();
    $notesContainer.attr('data-list', '');
  },

  renderForms() {
    let $inputs = $('.inputs-container');

    $inputs.html(this.inputTemplate());
    autosize($('textarea'));

    return this;
  },

  createOnEnter(e) {
    if (e.keyCode === 13) {
      app.createNote();
    }
  },

  validate() {
    let body = $('.note-input').val(),
        list = $('.list-input').val(),
        $check = $('.create-note-btn .fa');

    if (body.trim() && list.trim() !== '') {
      $check.addClass('ready');
    }
    else {
      $check.removeClass('ready');
    }
  },

  createNote() {
    let body = $('.note-input').val(),
        list = $('.list-input').val(),
        done = false;

    if (body.trim() && list.trim() !== '') {
      let note = {body, list, done};

      if (app.listsCollection.length > 0) {
        for (let i = 0; i < app.listsCollection.length; i++) {
          let inMemory = app.listsCollection.models[i].body;
          if (note.body === inMemory) {
            return false;
          }
        }
      }

      app.post(note);
    }

    return this;
  },
});