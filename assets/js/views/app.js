RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate: _.template($('#input-template').html()),

  user: null,
  listsCollection: null,
  notesCollection: null,
  activeListId: null,

  initialize: function() {
    this.renderInputFields();
  },

  events: {
    'click .create-list-btn'            : 'createList',
    'click .toggle-list-btn'            : 'toggleLists',
    'click .create-note-btn'            : 'createNote',
    'keyup .note-input'                 : 'createOnEnter',
    'keyup .active-input'               : 'validate'
    // 'click .garbage-container'          : 'removeAllDone',
    // 'focus .list-input'                 : 'isMakingNewList',
    // 'keyup .list-input'                 : 'compareListValue'
  },

  createList: function() {
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $notesContainer = $('.active-notes-container');

    $noteInput.val('');
    $listInput.val('').focus();
    $notesContainer.empty();
    this.onChangeListeners();
  },

  renderInputFields: function() {
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
    let body = $('.note-input').val(),
        list = $('.list-input').val();

    if (body.trim() && list.trim() !== '') {

      let note = {
        body: body,
        list: list,
        done: false
      };

      if (app.listsCollection.length > 0) {

        for (let i = 0; i < app.listsCollection.length; i++) {
          let inMemory = app.listsCollection.models[i].body;

          if (note.body === inMemory) {
            return false;
          }
        }

      }

    this.post(note);

    }

  },
  // grabValueSnapshot: function() {

  //   if (this.isListSelected) {
  //     var listname = $('.list-input').val();

  //     return listname;
  //   }

  // },

  // isMakingNewList: function() {
  //   var listnamesArray = this.getLists();
  //   var listname = this.grabValueSnapshot();

  //   if (listname) {
  //     this.currentList = listname;
  //     this.allLists = listnamesArray;
  //   }
  //   else {

  //     return false;
  //   }

  // },

  // compareListValue: function() {
  //   var typing = $('.list-input').val();
  //   var $activeNotes = $('.active-notes-container');

  //   if (typing !== this.currentList) {
  //     $activeNotes.hide();
  //     this.checkMatchingLists(typing);

  //   }
  //   else {

  //     $activeNotes.show();
  //   }

  // },

  // checkMatchingLists: function(string) {
  //   var $notesContainer = $('.active-notes-container');
  //   var notes;

  //   for (var i = 0; i < this.allLists.length; i++) {

  //     if (string === this.allLists[i]) {

  //       notes = this.getNotesByListname(string);
  //       this.setNotes($notesContainer, notes);
  //       $notesContainer.show();

  //     }
  //   }
  // },


});