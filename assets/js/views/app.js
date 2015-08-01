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
    'click .lists-container .list-item' : 'renderList',
    'click .create-list-btn'            : 'createList',
    'click .toggle-list-btn'            : 'toggleLists',
    'click .create-note-btn'            : 'createNote',
    'keyup .note-input'                 : 'createOnEnter',
    'keyup .active-input'               : 'validate',
    'click .garbage-container'          : 'removeAllDone',
    'focus .list-input'                 : 'isMakingNewList',
    'keyup .list-input'                 : 'compareListValue'
  },

  grabValueSnapshot: function() {

    if (this.isListSelected) {
      var listname = $('.list-input').val();

      return listname;
    }

  },

  isMakingNewList: function() {
    var listnamesArray = this.getLists();
    var listname = this.grabValueSnapshot();

    if (listname) {
      this.currentList = listname;
      this.allLists = listnamesArray;
    }
    else {

      return false;
    }

  },

  compareListValue: function() {
    var typing = $('.list-input').val();
    var $activeNotes = $('.active-notes-container');

    if (typing !== this.currentList) {
      $activeNotes.hide();
      this.checkMatchingLists(typing);

    }
    else {

      $activeNotes.show();
    }

  },

  checkMatchingLists: function(string) {
    var $notesContainer = $('.active-notes-container');
    var notes;

    for (var i = 0; i < this.allLists.length; i++) {

      if (string === this.allLists[i]) {

        notes = this.getNotesByListname(string);
        this.setNotes($notesContainer, notes);
        $notesContainer.show();

      }
    }
  },

  renderList: function(e) {
    var listname = $(e.currentTarget).data('id');
    var notes = this.collection.where({list: listname});

    this.setNotes('.active-notes-container', notes);
    this.deviceEnv(400);
    this.onChangeListeners();

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
    var $body = $('.note-input').val();
    var $list = $('.list-input').val();

    if ($body.trim() && $list.trim() !== '') {
      var date = Date.now();
      var timestamp = this.convertDate(date);

      var note = {

        body: $body,
        list: $list,
        created: date,
        timestamp: timestamp,
        done: false

      };

      var alreadyExists = this.collection.findWhere({
        body: note.body,
        list: note.list
      });

      if (alreadyExists) {

        return false;
      }

      this.post(note);
    }

  },

  removeAllDone: function() {
    var listname = $('.list-input').val();
    var models = this.collection.where({
      list: listname,
      done: true
    });

    console.log(models.length);

    for (var i = 0; i < models.length; i++) {
      this.destroy(models[i]);
    }

    var remaining = this.collection.where({
      list: listname
    });

    console.log(remaining);
    if (remaining) {
      this.setListValue(listname);

    }
    else {
      $noteInput.val('');
      $listInput.val('').focus();
      $notesContainer.empty();

    }

  },



});