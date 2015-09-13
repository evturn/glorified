// ===================
// View Helpers
// ===================

_.extend(Backbone.View.prototype, {

  getActiveListId() {
    let id = app.activeListId;

    return id;
  },
  setActiveListId(id) {
    // Too small of a utility and possibly redundant
    app.$notesContainer.attr('data-list', id);
    app.activeListId = id;

    return this;
  },
  getListContainerById(id) {
    let $listItem = $('.list-item .inner-container');

    return $listItem.find("[data-id='" + id + "']");
  },
  getListItemIconById(id) {
    return $('div').find("[data-list-item-icon='" + id + "']");
  },
  removeListItemById(id) {
    let $container = app.getListContainerById(id);

    $container.parent().remove();
  },
  setListValue(listname) {
    app.$listInput.val(listname);
  },
  resetActiveList(id) {
    let $listItem = $('.list-item'),
        $element = $('div').find("[data-id='" + id + "']");

    $listItem.removeClass('active');
    $element.parent().addClass('active');

    return $element;
  },
  /////////////////
  renderForms() {
    let $inputs = $('.inputs-container');

    $inputs.html(RB.inputsTemplate());
    autosize($('textarea'));

    return this;
  },
  /////////////////
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
      $barContainer.html(RB.progressBarTemplate(data));
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
  tojquery(element) {
    switch (typeof element) {
      case "object":
        if (element instanceof jQuery) {
          return element;
        }
        break;
      case "string":
        if (element.charAt(0) === '.') {
          return $(element);
        }
        else {
          return $(document.getElementsByClassName(element));
        }
        break;
    }
  },
  convertDate(date) {
    let d = new Date(date),
        days      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        year      = d.getFullYear(),
        _month    = d.getMonth(),
        month     = ('' + (_month + 1)).slice(-2),
        day       = d.getDate(),
        hours     = d.getHours(),
        _minutes  = d.getMinutes(),
        minutes   = _minutes > 10 ? _minutes : ('0' + _minutes),
        meridiem  = hours >= 12 ? 'pm' : 'am',
        _hour     = hours > 12 ? hours - 12 : hours,
        hour      = _hour === 0 ? 12 : _hour,
        timestamp =  month + '/' + day + ' ' + hour + ':' + minutes + meridiem + ' ' + days[d.getDay()];

    return timestamp;
  },
});