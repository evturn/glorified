// ===================
// View Helpers
// ===================

_.extend(Backbone.View.prototype, {

  garbageTemplate : _.template($('#garbage-watcher-template').html()),
  allDoneTemplate : _.template($('#sunny-template').html()),
  progressBarTemplate : _.template($('#progress-bar-template').html()),

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
        notes = new RB.Notes(list.attributes.notes),
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

  getActiveListId() {
    let id = app.activeListId;

    return id;
  },

  setActiveListId(id) {
    let $container = $('.notes-container');

    $container.attr('data-list', id);
    app.activeListId = id;

    return this;
  },

  getListContainerById(id) {
    let $listItem = $('.list-item .inner-container');

    return $listItem.find("[data-id='" + id + "']");
  },

  removeListItemById(id) {
    let $container = app.getListContainerById(id);

    $container.parent().remove();
  },

  setListValue(listname) {
    let $listInput = $('.list-input');

    $listInput.val(listname);
  },

  resetActiveList(listname) {
    let $listItem = $('.list-item'),
        $element = $('div').find("[data-id='" + listname + "']");

    $listItem.removeClass('active');
    $element.addClass('active');

    return $element;
  },

  renderActiveProgressBar(id) {
    let collection = app.notesCollection,
        $barContainer = $('.active-progress'),
        _id = id,
        length = collection.length,
        notDone = collection.where({done: false}).length,
        done = length - notDone,
        notDonePct = ((notDone / length) * 100) + '%',
        notDoneText = (parseInt(notDonePct).toFixed(0)) + '%',
        donePct = ((done / length) * 100) + '%',
        doneText = (parseInt(donePct).toFixed(0)) + '%',
        data = {
          name,
          _id,
          length,
          notDone,
          notDonePct,
          notDoneText,
          done,
          donePct,
          doneText
        };

    if ($barContainer.children().length === 0) {
      $barContainer.html(app.progressBarTemplate(data));
    }

    let $done = $('#list-progress').find("[data-done='" + data._id + "']"),
        $notDone = $('#list-progress').find("[data-notDone='" + data._id + "']"),
        $notDoneText = $('.not-done-text'),
        $doneText = $('.done-text');

    $done.css({'width': data.donePct});
    $notDone.css({'width': data.notDonePct});
    $doneText.html(data.doneText);
    $notDoneText.html(data.notDoneText);

    if (app.activeListId && app.activeListId === data._id) {
      app.hasLengthChanged(data);
    }


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

      if (app.activeListId && app.activeListId === list._id) {
        app.hasLengthChanged(list);
      }
    });
  },

  animateListTotal(list) {
    let $length = $('div').find("[data-length='" + list._id + "']");

    $length.removeClass('fadeInUp');
    $length.text(list.length);
    $length.addClass('fadeOutUp');

    setTimeout(function() {
      $length.removeClass('fadeOutUp');
      $length.addClass('fadeInUp');
      $length.show();

    }, 300);
  },

  hasLengthChanged(list) {
    if (app.activeListLength === list.length) {
      return false;
    }
    else {
      app.activeListLength = list.length;
      app.animateListTotal(list);
      return true;
    }
  },

});