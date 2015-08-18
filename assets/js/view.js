// ===================
// View Helpers
// ===================

_.extend(Backbone.View.prototype, {

  garbageTemplate : _.template($('#garbage-watcher-template').html()),
  allDoneTemplate : _.template($('#sunny-template').html()),

  setLists() {
    let $container = $('.lists-container');

    $container.empty();

    app.listsCollection.each(function(model) {
      let view = new RB.ListItem({model: model});

      $container.append(view.render().el);
    });

  },

  setNote(model) {
    let $notesContainer = $('.active-notes-container'),
        view = new RB.NoteItem({model: model});

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
    app.listenTo(app.notesCollection, 'change', this.updateListTotal);
    app.resetActiveList(listname);
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

  getListContainerById(id) {
    let $listItem = $('.list-item .inner-container');

    return $listItem.find("[data-id='" + id + "']");
  },

  setListValue(listname) {
    let $listInput = $('.active-input.list-input');

    $listInput.val(listname);
  },

  resetActiveList(listname) {
    let $listItem = $('.list-item'),
        $element = $('div').find("[data-id='" + listname + "']");

    $listItem.removeClass('active');
    $element.addClass('active');

    return $element;
  },

  appendActiveListStats() {
    let number = app.notesCollection.where({done: true}).length,
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

  updateListTotal() {
    let $container = $('.active-notes-container'),
        length = $container.children().length,
        id = $container.attr('data-list'),
        $element = $('div').find("[data-id='" + id + "']"),
        $span = $element.find('.badge');

    $span.text(length);
  },

  setProgressBars() {
    let listData = [],
        i = 0;

    app.listsCollection.each(function(list) {
      let _id = list.id,
          name = list.attributes.name,
          collection = new RB.Notes(list.attributes.notes),
          length = collection.length,
          notDone = collection.where({done: false}).length,
          done = length - notDone,
          notDonePct = ((notDone / length) * 100) + '%',
          donePct = ((done / length) * 100) + '%',
          data = {
            name,
            _id,
            length,
            notDone,
            notDonePct,
            done,
            donePct
          };

      listData.push(data);
      collection.stopListening();
      i++;
    });

    listData.forEach(function(list) {
      let $done = $('div').find("[data-done='" + list._id + "']"),
          $notDone = $('div').find("[data-notDone='" + list._id + "']");

      $done.css({'width': list.donePct});
      $notDone.css({'width': list.notDonePct});
    });
  },

});