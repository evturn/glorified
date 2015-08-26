RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate       : _.template($('#input-template').html()),
  progressBarTemplate : _.template($('#progress-bar-template').html()),

  events: {
    'click .create-list-btn' : 'createList',
    'click .create-note-btn' : 'createNote',
    'keyup .note-input'      : 'createOnEnter',
    'keyup .activeInput'     : 'validate'
  },

  createNote() {
    let body = app.$noteInput.val(),
        list = app.$listInput.val(),
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

  createList() {
    let $barContainer = $('.active-progress'),
        $notesContainer = $('.notes-container');

    app.$noteInput.val('');
    app.$listInput.val('').focus();
    app.activeListId = null;
    $notesContainer.empty();
    $barContainer.empty();
    $notesContainer.attr('data-list', '');
  },

  createOnEnter(e) {
    if (e.keyCode === 13) {
      app.createNote();
    }
  },

  validate() {
    let body = app.$noteInput.val(),
        list = app.$listInput.val(),
        $check = $('.create-note-btn .fa');

    if (body.trim() && list.trim() !== '') {
      $check.addClass('ready');
    }
    else {
      $check.removeClass('ready');
    }
  },

  setLists() {
    let $container = $('.lists-container');

    $container.empty();

    app.listsCollection.each(function(model) {
      let view = new RB.ListItem({model: model});

      $container.append(view.render().el);
    });
  },

  setNote(model) {
    let $notesContainer = $('.notes-container'),
        view = new RB.NoteItem({model: model});

    $notesContainer.append(view.render().el);
  },

  setNotes(id) {
    let list = app.listsCollection.get(id),
        sorted = app.sortNotes(list.attributes.notes),
        notes = new RB.Notes(sorted),
        listname = list.attributes.name,
        $container = $('.notes-container'),
        $listInput = $('.list-input'),
        $noteInput = $('.note-input');

    $container.empty();
    $listInput.val(listname);

    notes.each(function(note) {
      let view = new RB.NoteItem({model: note});

      $container.append(view.render().el);
    });

    if (app.activeListLength === null) {
      app.activeListLength = notes.length;
    }

    app.notesCollection = notes;
    app.resetActiveList(listname);
    app.renderActiveProgressBar(id);
  },

  sortNotes(list) {
    let sorted = _.sortBy(list, 'done');

   return sorted;
  },

});