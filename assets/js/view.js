// ===================
// View Helpers
// ===================

_.extend(Backbone.View.prototype, {

  garbageTemplate : _.template($('#garbage-watcher-template').html()),
  allDoneTemplate : _.template($('#sunny-template').html()),

  getNotesByListname: function(listname) {
    var notes = app.listsCollection.where({name: listname});

    return notes;
  },

  getListNames() {
    var self = this;
    var array = [];

    app.listsCollection.each(function(model) {
      array.push(model.get('name'));
    });

    return array;
  },

  setLists() {
    var $container = $('.lists-container');
    $container.empty();

    app.listsCollection.each(function(model) {
      var view = new RB.ListItem({model: model});

      $container.append(view.render().el);
    });

  },

  setNote(model) {
    var $notesContainer = $('.active-notes-container');
    var view = new RB.NoteItem({model: model});

    $notesContainer.append(view.render().el);
  },

  setNotes(id) {
    let list = app.listsCollection.get(id),
        notes = new RB.Notes(list.attributes.notes),
        listname = list.attributes.name,
        $container = $('.active-notes-container'),
        $listInput = $('.active-input.list-input'),
        $noteInput = $('.active-input.note-input');

    $container.empty();
    $listInput.val(listname);

    notes.each(function(note) {
      let view = new RB.NoteItem({model: note});

      $container.append(view.render().el);
    });

    app.notesCollection = notes;
    this.resetActiveList(listname);
    console.log(app.notesCollection);
  },

  getActiveListId() {
    let id = app.activeListId;

    return id;
  },

  setActiveListId(id) {
    let $container = $('.active-notes-container');

    $container.attr('data-list', id);
    app.activeListId = id;

    return this;
  },

  setListValue: function(listname) {
    var $listInput = $('.active-input.list-input');
    $listInput.val(listname);
  },

  resetActiveList: function(listname) {
    var $listItem = $('.list-item');
    var $element = $('div').find("[data-id='" + listname + "']");

    $listItem.removeClass('active');
    $element.addClass('active');

    return $element;
  },

  appendActiveListStats() {
    let number = app.notesCollection.length,
        $garbageContainer = $('.garbage-container'),
        $statContainer = $('.garbage-container .stat'),
        $trashContainer = $('.garbage-container .edit');

    $garbageContainer.empty();

    if (number !== 0) {
      $garbageContainer.html(this.garbageTemplate({length: number}));

    }
    else {
      $garbageContainer.html(this.allDoneTemplate());

    }

    return this;
  },

  getListnameContainer: function(listname) {
    var $element = $('div').find("[data-id='" + listname + "']");

    return $element;
  },

});