RB.App = Backbone.View.extend({

  el: '.dmc',

  iconSelectTemplate       : _.template($('#icon-select-template').html()),
  iconPlaceholderTemplate  : _.template($('#icon-placeholder-template').html()),
  iconTemplate             : _.template($('#icon-template').html()),

  events: {
    'click .create-list-btn' : 'createList',
    'click .create-note-btn' : 'createNote',
    'keypress .note-input'   : 'createOnEnter',
    'keyup .activeInput'     : 'validate'
  },

  initialize() {
    let app = this;
    EventHandlers(app);
  },

  start() {
    app.renderForms();
    app.appendIcons();
    app.user                 = new RB.User();
    app.listsCollection      = null;
    app.notesCollection      = null;
    app.activeListId         = null;
    app.activeListLength     = null;
    app.mobileClient         = null;
    app.tabletClient         = null;
    app.desktopClient        = null;
    app.windowWidth          = $(window).width();
    app.windowX              = window.innerWidth;
    app.$lists               = $('.lists');
    app.$notes               = $('.notes');
    app.$listInput           = $('.list-input');
    app.$noteInput           = $('.note-input');
    app.$notesContainer      = $('.notes-container');
    app.$listsContainer      = $('.lists-container');
    app.initializeListeners();

    app.user.fetch({
      success(model, response) {
        if (app.listsCollection === null) {
            app.listsCollection = new RB.Lists(model.attributes.lists);
            app.setLists();
            app.setProgressBars();
        }

        return app.listsCollection;
      },
      error(err) {
        console.log(err);
      }
    });
  },
  updateListIcon(icon) {
    let _id = app.activeListId,
        $listItemIcon = app.getListItemIconById(_id),
        notes = app.listsCollection.models,
        length = notes.length,
        attributes = {icon, _id, notes},
        listModel = new RB.List(attributes);

    app.list.put(listModel, attributes);
    attributes.length = length;
    $listItemIcon.html(RB.listItemIconTemplate(attributes));
  },
  createNote() {
    let body = app.$noteInput.val(),
        list = app.$listInput.val(),
        done = false;

    if (body.trim() && list.trim() !== '') {
        let data = {body, list, done};

      if (app.listsCollection.length > 0) {
          for (let i = 0; i < app.listsCollection.length; i++) {
              let inMemory = app.listsCollection.models[i].body;

              if (data.body === inMemory) {
                return false;
              }
          }
      }
      app.post(data);
    }
  },
  createList() {
    let $barContainer = $('.active-progress'),
        $iconContainer = $('.input-container .icon-container');

    app.$noteInput.val('');
    app.$listInput.val('').focus();
    app.activeListId = null;
    app.$notesContainer.empty();
    $iconContainer.html(this.iconPlaceholderTemplate());
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
    autosize(document.querySelectorAll('textarea'));
  },
  setNotes(id) {
    let list = app.listsCollection.get(id),
        sorted = app.sortNotes(list.attributes.notes),
        notes = new RB.Notes(sorted),
        listname = list.attributes.name,
        $iconContainer = $('.input-container .icon-container'),
        icon = list.attributes.icon ? {icon: list.attributes.icon} : {icon: 'fa fa-tasks'};


    app.$notesContainer.empty();
    app.$listInput.val(listname);
    $iconContainer.empty();
    $iconContainer.append(app.iconTemplate(icon));

    notes.each(function(note) {
      let view = new RB.NoteItem({model: note});

      app.$notesContainer.append(view.render().el);
    });

    if (app.activeListLength === null) {
       app.activeListLength = notes.length;
    }

    app.notesCollection = notes;
    app.resetActiveList(listname);
    let listData = app.getListData(id);
    app.renderActiveProgressBar(listData);
  },
  sortNotes(list) {
    let sorted = _.sortBy(list, 'done');

   return sorted;
  },
});