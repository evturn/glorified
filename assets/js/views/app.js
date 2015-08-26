RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate       : _.template($('#input-template').html()),
  progressBarTemplate : _.template($('#progress-bar-template').html()),
  iconSelectTemplate  : _.template($('#icon-select-template').html()),
  iconTemplate        : _.template($('#icon-template').html()),

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
    let $barContainer = $('.active-progress');

    app.$noteInput.val('');
    app.$listInput.val('').focus();
    app.activeListId = null;
    app.$notesContainer.empty();
    $barContainer.empty();
    app.$notesContainer.attr('data-list', '');
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
    app.$listsContainer.empty();

    app.listsCollection.each(function(model) {
      let view = new RB.ListItem({model: model});

      app.$listsContainer.append(view.render().el);
    });
  },

  setNote(model) {
    let view = new RB.NoteItem({model: model});

    app.$notesContainer.append(view.render().el);
  },

  setNotes(id) {
    let list = app.listsCollection.get(id),
        sorted = app.sortNotes(list.attributes.notes),
        notes = new RB.Notes(sorted),
        listname = list.attributes.name,
        $listIcon = $('.list-icon'),
        icon = list.attributes.icon ? {icon: list.attributes.icon} : {icon: 'fa fa-list'};


    app.$notesContainer.empty();
    app.$listInput.val(listname);
    $listIcon.empty();
    $listIcon.append(app.iconTemplate(icon));

    notes.each(function(note) {
      let view = new RB.NoteItem({model: note});

      app.$notesContainer.append(view.render().el);
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