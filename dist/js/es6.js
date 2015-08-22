'use strict';

var RB = {};

RB.User = Backbone.Model.extend({
  url: '/users',
  idAttribute: '_id'
});

RB.Note = Backbone.Model.extend({
  idAttribute: '_id'
});

RB.List = Backbone.Model.extend({
  idAttribute: '_id'
});

RB.Lists = Backbone.Collection.extend({
  model: RB.List,
  url: '/notes'
});

// Should be converted to User?
RB.Notes = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
  merge: true
});
// ===================
// HTTP
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  start: function start() {
    app.user = new RB.User();
    app.helpers.init();

    app.user.fetch({
      success: function success(model, response) {
        if (app.user === null) {
          app.user = model;
        }

        if (app.listsCollection === null) {
          app.listsCollection = new RB.Lists(model.attributes.lists);
          app.setLists();
          app.setProgressBars();
        }

        return app.listsCollection;
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  get: function get() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { render: true } : arguments[0];

    app.user.fetch({
      success: function success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);
        if (app.activeListId && options.render) {
          app.setNotes(app.activeListId);
        } else {
          app.setLists();
        }
        app.setProgressBars();
        console.log('GET: ', app.listsCollection);
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  post: function post(model) {
    var self = this,
        $noteInput = $('.note-input'),
        $notesContainer = $('.notes-container');

    $.ajax({
      url: '/notes/',
      method: 'POST',
      data: model,
      success: function success(model, response) {
        var note = new RB.Note(model),
            view = new RB.NoteItem({ model: note });

        $notesContainer.append(view.render().el);
        $noteInput.val('').focus();
        app.validate();
        app.notify('Created');
        app.get();
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  put: function put(model, attributes, view) {
    var id = model.get('_id');

    model.save(attributes, {
      url: '/notes/' + id,
      success: function success(model, response) {
        app.notify('Updated');
        app.get();
      },
      error: function error(_error) {
        console.log('error ', _error);
      }
    });
  },

  destroy: function destroy(model) {
    var id = model.get('_id'),
        listId = app.getActiveListId();

    model.set('listId', listId);

    if (id !== null) {
      model.destroy({
        url: '/notes/' + id + '?listId=' + listId,
        success: function success(model, response) {
          console.log('success ', model);
          app.notify('Removed');
          app.get();
        },
        error: function error(err) {
          console.log('error ', err);
        }
      });
    }
  },

  list: {

    destroy: function destroy(model, id) {
      if (id !== null) {
        model.destroy({
          url: '/lists/' + id,
          success: function success(model, response) {
            console.log('success ', model);
            app.removeListItemById(id);
            app.notify('Removed');
            app.get({ render: false });
          },
          error: function error(err) {
            console.log('error ', err);
          }
        });
      }
    }

  }
});
// ===================
// View Helpers
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  garbageTemplate: _.template($('#garbage-watcher-template').html()),
  allDoneTemplate: _.template($('#sunny-template').html()),

  setLists: function setLists() {
    var $container = $('.lists-container');

    $container.empty();

    app.listsCollection.each(function (model) {
      var view = new RB.ListItem({ model: model });

      $container.append(view.render().el);
    });
  },

  setNote: function setNote(model) {
    var $notesContainer = $('.notes-container'),
        view = new RB.NoteItem({ model: model });

    $notesContainer.append(view.render().el);
  },

  setNotes: function setNotes(id) {
    var list = app.listsCollection.get(id),
        notes = new RB.Notes(list.attributes.notes),
        listname = list.attributes.name,
        $container = $('.notes-container'),
        $listInput = $('.list-input'),
        $noteInput = $('.note-input');

    $container.empty();
    $listInput.val(listname);

    notes.each(function (note) {
      var view = new RB.NoteItem({ model: note });

      $container.append(view.render().el);
    });

    if (app.activeListLength === null) {
      app.activeListLength = notes.length;
      console.log(app.activeListLength);
    }

    app.notesCollection = notes;
    app.resetActiveList(listname);
  },

  getActiveListId: function getActiveListId() {
    var id = app.activeListId;

    return id;
  },

  setActiveListId: function setActiveListId(id) {
    var $container = $('.notes-container');

    $container.attr('data-list', id);
    app.activeListId = id;

    return this;
  },

  getListContainerById: function getListContainerById(id) {
    var $listItem = $('.list-item .inner-container');

    return $listItem.find("[data-id='" + id + "']");
  },

  removeListItemById: function removeListItemById(id) {
    var $container = app.getListContainerById(id);

    $container.parent().remove();
  },

  setListValue: function setListValue(listname) {
    var $listInput = $('.list-input');

    $listInput.val(listname);
  },

  resetActiveList: function resetActiveList(listname) {
    var $listItem = $('.list-item'),
        $element = $('div').find("[data-id='" + listname + "']");

    $listItem.removeClass('active');
    $element.addClass('active');

    return $element;
  },

  setProgressBars: function setProgressBars() {
    var listData = [],
        i = 0;

    app.listsCollection.each(function (list) {
      var _id = list.id,
          name = list.attributes.name,
          collection = new RB.Notes(list.attributes.notes),
          length = collection.length,
          notDone = collection.where({ done: false }).length,
          done = length - notDone,
          notDonePct = notDone / length * 100 + '%',
          donePct = done / length * 100 + '%',
          data = {
        name: name,
        _id: _id,
        length: length,
        notDone: notDone,
        notDonePct: notDonePct,
        done: done,
        donePct: donePct
      };

      listData.push(data);
      collection.stopListening();
      i++;
    });

    listData.forEach(function (list) {
      var $done = $('div').find("[data-done='" + list._id + "']"),
          $notDone = $('div').find("[data-notDone='" + list._id + "']");

      $done.css({ 'width': list.donePct });
      $notDone.css({ 'width': list.notDonePct });

      if (app.activeListId && app.activeListId === list._id) {
        app.hasLengthChanged(list);
      }
    });
  },

  animateListTotal: function animateListTotal(list) {
    var $length = $('div').find("[data-length='" + list._id + "']");

    $length.removeClass('fadeInUp');
    $length.text(list.length);
    $length.addClass('fadeOutUp');

    setTimeout(function () {
      $length.removeClass('fadeOutUp');
      $length.addClass('fadeInUp');
      $length.show();
    }, 300);
  },

  hasLengthChanged: function hasLengthChanged(list) {
    if (app.activeListLength === list.length) {
      return false;
    } else {
      app.activeListLength = list.length;
      app.animateListTotal(list);
      return true;
    }
  }

});
// ===================
// Helpers
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  helpers: {
    init: function init() {
      app.fixPath();
      app.onClickSetActive();
      app.isMobile(800);
    }
  },

  notify: function notify(notification) {
    var $loader = $('.kurt-loader');

    $loader.html('<p class="thin-sm animated fadeIn">' + notification + '</p>');

    var $paragraphTag = $loader.find('.thin-sm');

    setTimeout(function () {
      $paragraphTag.removeClass('animated fadeIn');
      $paragraphTag.addClass('animated fadeOut');
    }, 1000);
  },

  tojquery: function tojquery(element) {
    switch (typeof element) {
      case "object":
        if (element instanceof jQuery) {
          return element;
        }
        break;
      case "string":
        if (element.charAt(0) === '.') {
          return $(element);
        } else {
          return $(document.getElementsByClassName(element));
        }
        break;
    }
  },

  convertDate: function convertDate(date) {
    var d = new Date(date),
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        year = d.getFullYear(),
        _month = d.getMonth(),
        month = ('' + (_month + 1)).slice(-2),
        day = d.getDate(),
        hours = d.getHours(),
        _minutes = d.getMinutes(),
        minutes = _minutes > 10 ? _minutes : '0' + _minutes,
        meridiem = hours >= 12 ? 'PM' : 'AM',
        _hour = hours > 12 ? hours - 12 : hours,
        hour = _hour === 0 ? 12 : _hour,
        timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + minutes + meridiem;

    return timestamp;
  },

  onClickSetActive: function onClickSetActive() {
    $(document).on('click', '.lists-container .list-item', function () {
      var $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
    });
  },

  toggleLists: function toggleLists() {
    var $listsContainer = $('.lists-container'),
        $icon = $('.toggle-list-btn .fa');

    $listsContainer.slideToggle('fast');
    $icon.toggleClass('collapsed');
  },

  isMobile: function isMobile(duration) {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (device) {
      setTimeout(this.toggleLists, duration);
    }

    return;
  },

  fixPath: function fixPath() {
    if (window.location.hash && window.location.hash === "#_=_") {
      var _scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };

      window.location.hash = "";
      document.body.scrollTop = _scroll.top;
      document.body.scrollLeft = _scroll.left;
    }
  }
});
'use strict';

RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate: _.template($('#input-template').html()),

  user: null,
  listsCollection: null,
  notesCollection: null,
  activeListId: null,
  activeListLength: null,

  initialize: function initialize() {
    this.renderInputFields();
  },

  events: {
    'click .create-list-btn': 'createList',
    'click .toggle-list-btn': 'toggleLists',
    'click .create-note-btn': 'createNote',
    'keyup .note-input': 'createOnEnter',
    'keyup .activeInput': 'validate'
  },

  createList: function createList() {
    var $noteInput = $('.note-input'),
        $listInput = $('.list-input'),
        $notesContainer = $('.notes-container');

    $noteInput.val('');
    $listInput.val('').focus();
    $notesContainer.empty();
  },

  renderInputFields: function renderInputFields() {
    $('.inputs-container').html(this.inputTemplate());

    return this;
  },

  createOnEnter: function createOnEnter(e) {
    if (e.keyCode === 13) {
      app.createNote();
    }
  },

  validate: function validate() {
    var body = $('.note-input').val(),
        list = $('.list-input').val(),
        $check = $('.create-note-btn .fa');

    if (body.trim() && list.trim() !== '') {
      $check.addClass('ready');
    } else {
      $check.removeClass('ready');
    }
  },

  createNote: function createNote() {
    var body = $('.note-input').val(),
        list = $('.list-input').val(),
        done = false;

    if (body.trim() && list.trim() !== '') {
      var note = { body: body, list: list, done: done };

      if (app.listsCollection.length > 0) {
        for (var i = 0; i < app.listsCollection.length; i++) {
          var inMemory = app.listsCollection.models[i].body;
          if (note.body === inMemory) {
            return false;
          }
        }
      }

      app.post(note);
    }

    return this;
  }
});
'use strict';

RB.ListItem = Backbone.View.extend({

  className: 'list-item',
  listTemplate: _.template($('#list-name-template').html()),
  events: {
    'click .inner-container': 'selected'
  },
  initialize: function initialize() {
    this.render();
  },

  render: function render() {
    this.$el.html(this.listTemplate(this.model.toJSON()));

    return this;
  },

  selected: function selected(e) {
    var listId = $(e.currentTarget).data('id');

    this.setNotes(listId);
    this.setActiveListId(listId);
    this.isMobile(400);
  }

});
'use strict';

RB.NoteItem = Backbone.View.extend({

  className: 'note-item',

  itemTemplate: _.template($('#note-item-template').html()),
  attributes: {},
  initalize: function initalize() {
    this.listenTo(this.model, 'destroy', this.remove);
  },

  events: {
    'click .edit .fa-trash': 'destroyNote',
    'click .edit .fa-check-square': 'toggleDone',
    'click .note-text': 'positionCursor',
    'blur .note-text': 'updateNoteBody',
    'keyup .note-text': 'updateNoteOnEnter'
  },

  render: function render() {
    if (!this.model.get('timestamp') && this.model.get('created')) {
      var created = this.model.get('created');

      this.model.set('timestamp', this.convertDate(created));
    } else if (!this.model.get('timestamp') && !this.model.get('created')) {
      this.model.set('timestamp', this.convertDate(new Date()));
    }

    if (!this.model.get('done')) {
      this.model.set('done', false);
    }

    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  },

  positionCursor: function positionCursor(e) {
    var $input = $(e.currentTarget);
    var range = $input.val().length;

    if ($input.hasClass('busy')) {
      return false;
    } else {
      $input.addClass('busy');
      $input[0].setSelectionRange(range, range + 1);
    }
  },

  destroyNote: function destroyNote() {
    console.log(app.activeListLength);
    if (app.activeListLength === 1) {
      app.list.destroy(this.model, app.activeListId);
      return false;
    } else {
      this.destroy(this.model);
      this.remove();
    }
  },

  toggleDone: function toggleDone() {
    var isDone = this.model.get('done');
    var listId = this.getActiveListId();
    var attributes = {
      done: !isDone,
      listId: listId
    };

    this.put(this.model, attributes, this);
  },

  updateNoteBody: function updateNoteBody(e) {
    var $input = $(e.currentTarget);
    var content = $input.val().trim();
    var listId = this.getActiveListId();
    var attributes = { body: content, listId: listId };

    $input.removeClass('busy');
    this.put(this.model, attributes, this);
  },

  updateNoteOnEnter: function updateNoteOnEnter(e) {
    var $input = $(e.currentTarget);

    if (e.keyCode === 13) {
      $input.blur();
    }
  }

});
"use strict";

var app = new RB.App();
app.start();