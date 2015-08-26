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
    app.listsCollection = null;
    app.notesCollection = null;
    app.activeListId = null;
    app.activeListLength = null;
    app.mobileClient = null;
    app.tabletClient = null;
    app.desktopClient = null;
    app.renderForms();
    app.windowWidth = $(window).width();
    app.$lists = $('.lists');
    app.$notes = $('.notes');
    app.$listInput = $('.list-input');
    app.$noteInput = $('.note-input');
    app.helpers.init();
    app.listeners.init();

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
    var options = arguments.length <= 0 || arguments[0] === undefined ? { render: true, _id: false } : arguments[0];

    app.user.fetch({
      success: function success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);

        if (options._id) {
          app.activeListId = options._id;
          app.setActiveListId(app.activeListId);
          app.setLists();
        } else if (options.render === false) {
          app.setLists();
          app.setProgressBars();

          return false;
        }
        app.setNotes(app.activeListId);
        app.setProgressBars();
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
        console.log('model ', model);
        console.log('response ', response);
        $noteInput.val('').focus();
        app.validate();
        app.notify(response);
        app.get({ _id: model._id, render: true });
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
            app.createList();
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

  renderForms: function renderForms() {
    var $inputs = $('.inputs-container');

    $inputs.html(this.inputTemplate());
    autosize($('textarea'));

    return this;
  },

  renderActiveProgressBar: function renderActiveProgressBar(id) {
    var collection = app.notesCollection,
        $barContainer = $('.active-progress'),
        _id = id,
        length = collection.length,
        notDone = collection.where({ done: false }).length,
        done = length - notDone,
        notDonePct = notDone / length * 100 + '%',
        notDoneText = parseInt(notDonePct).toFixed(0) + '%',
        donePct = done / length * 100 + '%',
        doneText = parseInt(donePct).toFixed(0) + '%',
        data = {
      name: name,
      _id: _id,
      length: length,
      notDone: notDone,
      notDonePct: notDonePct,
      notDoneText: notDoneText,
      done: done,
      donePct: donePct,
      doneText: doneText
    };

    if ($barContainer.children().length === 0) {
      $barContainer.html(app.progressBarTemplate(data));
    }

    var $done = $('#list-progress').find("[data-done='" + data._id + "']"),
        $notDone = $('#list-progress').find("[data-notDone='" + data._id + "']"),
        $notDoneText = $('.not-done-text'),
        $doneText = $('.done-text');

    $done.css({ 'width': data.donePct });
    $notDone.css({ 'width': data.notDonePct });
    $doneText.html(data.doneText);
    $notDoneText.html(data.notDoneText);

    if (app.activeListId && app.activeListId === data._id) {
      app.hasLengthChanged(data);
    }
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
        meridiem = hours >= 12 ? 'pm' : 'am',
        _hour = hours > 12 ? hours - 12 : hours,
        hour = _hour === 0 ? 12 : _hour,
        timestamp = month + '/' + day + ' ' + hour + ':' + minutes + meridiem + ' ' + days[d.getDay()];

    return timestamp;
  }
});
// ===================
// Mobile
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  mobile: {

    init: function init() {
      app.setMobile();
    }
  },

  isMobile: function isMobile() {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return device;
  },

  setMobile: function setMobile() {
    var $body = $('body');

    $body.addClass('mobile');
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
      app.readClient();
      app.setClient();
      app.isMobile();
    }
  },

  listeners: {
    init: function init() {
      autosize(document.querySelectorAll('textarea'));

      $(window).resize(function () {
        app.windowWidth = $(window).width();
        app.setClient();
      });

      $(document).on('click', '.lists-container .list-item', function () {
        var $listItem = $('.list-item');

        $listItem.removeClass('active');
        $(this).addClass('active');
      });

      $(document).on('click', '.toggle-list-btn', function () {
        app.toggleLists();
      });

      $(document).on('click', '.active-progress', function () {
        $('.active-progress').toggleClass('show-details');
      });
    }
  },

  readClient: function readClient() {
    if (app.isMobile()) {
      app.mobileClient = true;
      app.mobile.init();
    } else {
      app.mobileClient = false;
    }

    if (app.windowWidth < 800 && app.windowWidth > 600) {
      app.tabletClient = true;
      app.desktopClient = false;
    } else if (app.windoWidth >= 800) {
      app.tabletClient = false;
      app.desktopClient = true;
    }
  },

  setClient: function setClient() {
    if (app.windowWidth > 600) {
      app.$notes.removeClass('expanded');
      app.$notes.removeClass('collapsed');
      app.$lists.removeClass('expanded');
      app.$lists.removeClass('collapsed');
      app.stopAnimation();
    } else {
      app.$notes.addClass('expanded');
      app.$lists.addClass('collapsed');
      app.animateContainers();
    }
  },

  toggleLists: function toggleLists() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { reset: false } : arguments[0];

    var $listsContainer = $('.lists-container'),
        $icon = $('.toggle-list-btn .fa'),
        $headerContainer = $('.header-container'),
        windowWidth = $(window).width(),
        headerHeight = $headerContainer.outerHeight();

    app.$lists.toggleClass('collapsed');
    app.$lists.toggleClass('expanded');
    app.$notes.toggleClass('expanded');
    app.$notes.toggleClass('collapsed');

    if (app.windowWidth < 600) {
      app.animateContainers();
    } else {
      app.stopAnimation();
    }
  },

  animateContainers: function animateContainers() {
    if (app.$lists.hasClass('collapsed') && app.$notes.hasClass('expanded')) {
      app.$lists.animate({ 'marginLeft': '-42%' }, 200);
      app.$notes.animate({ 'marginRight': '0%' }, 200);
    } else if (app.$lists.hasClass('expanded') && app.$notes.hasClass('collapsed')) {
      app.$notes.animate({ 'marginRight': '-45%' }, 200);
      app.$lists.animate({ 'marginLeft': '0%' }, 200);
    }
  },

  stopAnimation: function stopAnimation() {
    app.$notes.animate({ 'marginRight': '0%' }, 30);
    app.$lists.animate({ 'marginLeft': '0%' }, 30);
  },

  notify: function notify(notification) {
    var $loader = $('.kurt-loader .message');

    $loader.html(notification);
    $loader.removeClass('animated fadeOut');
    $loader.addClass('animated fadeIn');

    setTimeout(function () {
      $loader.removeClass('animated fadeIn');
      $loader.addClass('animated fadeOut');
    }, 1000);
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
'use strict';

RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate: _.template($('#input-template').html()),
  progressBarTemplate: _.template($('#progress-bar-template').html()),

  events: {
    'click .create-list-btn': 'createList',
    'click .create-note-btn': 'createNote',
    'keyup .note-input': 'createOnEnter',
    'keyup .activeInput': 'validate'
  },

  createNote: function createNote() {
    var body = app.$noteInput.val(),
        list = app.$listInput.val(),
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
  },

  createList: function createList() {
    var $barContainer = $('.active-progress'),
        $notesContainer = $('.notes-container');

    app.$noteInput.val('');
    app.$listInput.val('').focus();
    app.activeListId = null;
    $notesContainer.empty();
    $barContainer.empty();
    $notesContainer.attr('data-list', '');
  },

  createOnEnter: function createOnEnter(e) {
    if (e.keyCode === 13) {
      app.createNote();
    }
  },

  validate: function validate() {
    var body = app.$noteInput.val(),
        list = app.$listInput.val(),
        $check = $('.create-note-btn .fa');

    if (body.trim() && list.trim() !== '') {
      $check.addClass('ready');
    } else {
      $check.removeClass('ready');
    }
  },

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
        sorted = app.sortNotes(list.attributes.notes),
        notes = new RB.Notes(sorted),
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
    }

    app.notesCollection = notes;
    app.resetActiveList(listname);
    app.renderActiveProgressBar(id);
  },

  sortNotes: function sortNotes(list) {
    var sorted = _.sortBy(list, 'done');

    return sorted;
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
    var listId = $(e.currentTarget).data('id'),
        $barContainer = $('.active-progress');

    $barContainer.empty();
    app.setNotes(listId);
    app.setActiveListId(listId);
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
    autosize($('textarea'));
    $('textarea').css({ 'resize': 'none' });

    return this;
  },

  positionCursor: function positionCursor(e) {
    var $input = $(e.currentTarget),
        range = $input.val().length;

    if (app.isMobile) {
      return false;
    } else if ($input.hasClass('busy')) {
      return false;
    } else {
      $input.addClass('busy');
      $input[0].setSelectionRange(range, range + 1);
    }
  },

  destroyNote: function destroyNote() {
    if (app.activeListLength === 1) {
      app.list.destroy(this.model, app.activeListId);

      return false;
    } else {
      app.destroy(this.model);
      this.remove();
    }
  },

  toggleDone: function toggleDone() {
    var isDone = this.model.get('done'),
        listId = this.getActiveListId(),
        attributes = {
      done: !isDone,
      listId: listId
    };

    app.put(this.model, attributes, this);
  },

  updateNoteBody: function updateNoteBody(e) {
    var $input = $(e.currentTarget),
        content = $input.val().trim(),
        listId = this.getActiveListId(),
        attributes = {
      body: content,
      listId: listId
    };

    $input.removeClass('busy');
    app.put(this.model, attributes, this);
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