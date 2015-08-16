RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate: _.template($('#input-template').html()),

  initialize: function() {
    this.fixPath();
    this.get();
    this.init();
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
    var body = $('.note-input').val();
    var list = $('.list-input').val();

    if (body.trim() && list.trim() !== '') {

      var note = {
        body: body,
        list: list,
        done: false
      };


      if (_RB.collection.models > 0) {
        var currentList = _RB.collection.findWhere({
          name: list,
        });

        console.log(currentList);

        for (let i = 0; i < currentList.attributes.notes.length; i++) {
          let inMemory = currentList.attributes.notes[i].body;

          if (note.body === inMemory) {
            return false;
          }
        }

      }

    this.post(note);

    }

  },

  removeAllDone: function() {

    if (this.isListSelected()) {
      var listname = $('.list-input').val();
      var models = this.collection.where({
        list: listname,
        done: true
      });

      console.log(models);

      _.invoke(models, 'destroy');
      return false;
    }

  },



});