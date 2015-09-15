'use strict';

var slice = function slice() {
    return Function.prototype.call.apply(Array.prototype.slice, arguments);
};

var querySelectorAll = document.querySelectorAll.bind(document);

var querySelector = document.querySelector.bind(document);

var getElementById = document.getElementById.bind(document);

var toggleClass = function toggleClass(selector, className, condition) {
    condition ? selector.classList.remove(className) : selector.classList.add(className);
};

var addEvent = function addEvent(object, type, callback) {
    if (object === null || typeof object === 'undefined') {
        return false;
    }

    if (object.addEventListener) {
        object.addEventListener(type, createCallback(callback), false);
    } else if (object.attachEvent) {
        object.attachEvent('on' + type, createCallback(callback));
    } else {
        object['on' + type] = createCallback(callback);
    }

    function createCallback(fn) {
        var callback = function callback() {
            fn();
        };

        return callback;
    };
};
"use strict";

var Templates = function Templates() {

  RB.iconItemTemplate;
  RB.inputsTemplate;
  RB.progressBarTemplate;
  RB.listItemIconTemplate;

  RB.compileTemplates = function () {
    RB.iconItemCompiler();
    RB.inputsCompiler();
    RB.progressBarCompiler();
    RB.listItemIconCompiler();
  };

  RB.listItemIconCompiler = function () {
    var html = "<i class=\"animated zoomIn <%= icon %>\"></i>";

    return RB.listItemIconTemplate = _.template(html);
  };

  RB.progressBarCompiler = function () {
    var html = "\n      <div class=\"progress-bar-container\" id=\"list-progress\">\n        <div class=\"not-done\" data-notDone=\"<%= _id %>\">\n          <p class=\"not-done-text\"><%= notDoneText %></p>\n        </div>\n        <div class=\"done\" data-done=\"<%= _id %>\">\n          <p class=\"done-text\"><%= doneText %></p>\n        </div>\n      </div>";

    return RB.progressBarTemplate = _.template(html);
  };

  RB.iconItemCompiler = function () {
    var html = "\n        <div class=\"icon-option\" data-icon=\"fa <%= icon %>\">\n          <i class=\"animated fadeIn fa <%= icon %>\"></i>\n          <p class=\"caption\"><%= name %></p>\n        </div>";

    return RB.iconItemTemplate = _.template(html);
  };

  RB.inputsCompiler = function () {
    var html = "\n        <form class=\"active-form\">\n          <div class=\"input-container\">\n            <div class=\"icon-container\">\n              <span class=\"icon-placeholder\"><i class=\"fa fa-minus-square\"></i></span>\n            </div>\n            <input type=\"text\" class=\"activeInput list-input\" name=\"list\" placeholder=\"List\">\n            <div class=\"validation-container\">\n              <span class=\"kurt-loader\">\n                <p class=\"message\"></p>\n              </span>\n              <span class=\"create-note-btn\">\n                <i class=\"fa fa-check-circle\"></i>\n              </span>\n            </div>\n            <div class=\"icon-dropdown\">\n              <div class=\"icon-arrow\"></div>\n              <div class=\"icon-select\"></div>\n            </div>\n          </div>\n          <div class=\"input-container\">\n            <textarea type=\"text\" class=\"activeInput note-input\" name=\"body\" placeholder=\"New note...\"></textarea>\n          </div>\n        </form>\n        <div class=\"active-progress\"></div>";

    return RB.inputsTemplate = _.template(html);
  };

  return RB.compileTemplates();
};

Templates();
'use strict';

RB.User = Backbone.Model.extend({
  url: '/users',
  idAttribute: '_id'
});

RB.Note = Backbone.Model.extend({
  idAttribute: '_id'
});

RB.List = Backbone.Model.extend({
  idAttribute: '_id',
  url: '/lists'
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

  get: function get() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { listDestroyed: false, _id: false } : arguments[0];

    // listDestroyed : true  DELETE REQUEST (LIST)
    // _id           : true  POST REQUEST   (ALL)

    app.user.fetch({
      success: function success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);

        if (options.listDestroyed) {
          // LIST DESTROYED, no notes to render
          app.setLists();
          app.setProgressBars();
        } else if (options._id) {
          // NOTE CREATED, render all and render notes
          app.activeListId = options._id;
          app.setActiveListId(options._id);
          app.setLists();
          app.setNotes(options._id);
          app.setProgressBars();
        } else {
          // NOTE UPDATED
          app.setNotes(app.activeListId);
          app.resetActiveList(app.activeListId);
          app.setProgressBars();
        }
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  post: function post(model) {
    $.ajax({
      url: '/notes/',
      method: 'POST',
      data: model,
      success: function success(model, response) {
        app.$noteInput.val('').focus();
        app.validate();
        app.notify(response);
        app.get({ _id: model._id });
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
    var id = model.get('_id');

    model.set('listId', app.activeListId);

    if (id !== null) {
      model.destroy({
        // Change route to '/lists/:id/notes/:id'
        url: '/notes/' + id + '?listId=' + app.activeListId,
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

    put: function put(model, attributes) {
      var id = model.get('_id');

      model.save(attributes, {
        url: '/lists/' + id,
        success: function success(model, response) {
          app.notify('Updated');
          app.get();
        },
        error: function error(_error2) {
          console.log('error ', _error2);
        }
      });
    },

    destroy: function destroy(model, id) {
      if (id !== null) {
        model.destroy({
          url: '/lists/' + id,
          success: function success(model, response) {
            console.log('success ', model);
            app.removeListItemById(id);
            app.notify('Removed');
            app.get({ listDestroyed: true });
            app.createList();
          },
          error: function error(err) {
            console.log('error ', err);
          }
        });
      }
    }
  },

  _user: {

    post: function post(attributes) {
      $.ajax({
        url: '/users/login',
        method: 'POST',
        data: attributes,
        success: function success(data, response) {
          console.log(data);
          $('.log-message').html('<h3 class="header-text animated fadeInUp">' + data + '</h3>');
        },
        error: function error(err) {
          console.log(err);
        }
      });
    },

    put: function put(attributes) {
      var id = app.user.get('_id');

      app.user.save(attributes, {
        url: '/users/facebook/' + id,
        success: function success(model, response) {
          app.notify('Updated');
          console.log(model);
        },
        error: function error(_error3) {
          console.log('error ', _error3);
        }
      });
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
    // Too small of a utility and possibly redundant
    app.$notesContainer.attr('data-list', id);
    app.activeListId = id;

    return this;
  },
  getListContainerById: function getListContainerById(id) {
    var $listItem = $('.list-item .inner-container');

    return $listItem.find("[data-id='" + id + "']");
  },
  getListItemIconById: function getListItemIconById(id) {
    return $('div').find("[data-list-item-icon='" + id + "']");
  },
  removeListItemById: function removeListItemById(id) {
    var $container = app.getListContainerById(id);

    $container.parent().remove();
  },
  setListValue: function setListValue(listname) {
    app.$listInput.val(listname);
  },
  resetActiveList: function resetActiveList(id) {
    var $listItem = $('.list-item'),
        $element = $('div').find("[data-id='" + id + "']");

    $listItem.removeClass('active');
    $element.parent().addClass('active');

    return $element;
  },
  getListData: function getListData(id) {
    var collection = app.notesCollection,
        _id = id,
        length = collection.length,
        notDone = collection.where({ done: false }).length,
        done = length - notDone,
        notDonePct = notDone / length * 100 + '%',
        notDoneText = parseInt(notDonePct).toFixed(0) + '%',
        donePct = done / length * 100 + '%',
        doneText = parseInt(donePct).toFixed(0) + '%';

    return { name: name, _id: _id, length: length, notDone: notDone, notDonePct: notDonePct, notDoneText: notDoneText, done: done, donePct: donePct, doneText: doneText };
  },
  renderActiveProgressBar: function renderActiveProgressBar(listData) {
    var container = querySelector('.active-progress'),
        isBarEmpty = !!(container.children.length === 0),
        isMatch = !!(app.activeListId && app.activeListId === listData._id),
        elDone = undefined,
        elNotDone = undefined;

    isBarEmpty ? container.innerHTML = RB.progressBarTemplate(listData) : false;

    var parent = document.getElementById('list-progress'),
        children = slice(parent.children);

    for (var _iterator = children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var element = _ref;

      element.dataset.done ? elDone = element : elNotDone = element;
    }

    elDone.children.innerText = listData.doneText;
    elDone.style.width = listData.donePct;
    elNotDone.children.innerText = listData.noteDoneText;
    elNotDone.style.width = listData.notDonePct;

    isMatch ? app.hasLengthChanged(listData) : false;
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
          data = { name: name, _id: _id, length: length, notDone: notDone, notDonePct: notDonePct, done: done, donePct: donePct };

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
'use strict';

RB.App = Backbone.View.extend({

  el: '.dmc',

  iconSelectTemplate: _.template($('#icon-select-template').html()),
  iconPlaceholderTemplate: _.template($('#icon-placeholder-template').html()),
  iconTemplate: _.template($('#icon-template').html()),

  events: {
    'click .create-list-btn': 'createList',
    'click .create-note-btn': 'createNote',
    'keypress .note-input': 'createOnEnter',
    'keyup .activeInput': 'validate'
  },

  initialize: function initialize() {
    var app = this;
    EventHandlers(app);
  },

  start: function start() {
    app.renderForms();
    app.appendIcons();
    app.user = new RB.User();
    app.listsCollection = null;
    app.notesCollection = null;
    app.activeListId = null;
    app.activeListLength = null;
    app.mobileClient = null;
    app.tabletClient = null;
    app.desktopClient = null;
    app.windowWidth = $(window).width();
    app.windowX = window.innerWidth;
    app.$lists = $('.lists');
    app.$notes = $('.notes');
    app.$listInput = $('.list-input');
    app.$noteInput = $('.note-input');
    app.$notesContainer = $('.notes-container');
    app.$listsContainer = $('.lists-container');
    app.initializeListeners();

    app.user.fetch({
      success: function success(model, response) {
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
  updateListIcon: function updateListIcon(icon) {
    var _id = app.activeListId,
        $listItemIcon = app.getListItemIconById(_id),
        notes = app.listsCollection.models,
        length = notes.length,
        attributes = { icon: icon, _id: _id, notes: notes },
        listModel = new RB.List(attributes);

    app.list.put(listModel, attributes);
    attributes.length = length;
    $listItemIcon.html(RB.listItemIconTemplate(attributes));
  },
  createNote: function createNote() {
    var body = app.$noteInput.val(),
        list = app.$listInput.val(),
        done = false;

    if (body.trim() && list.trim() !== '') {
      var data = { body: body, list: list, done: done };

      if (app.listsCollection.length > 0) {
        for (var i = 0; i < app.listsCollection.length; i++) {
          var inMemory = app.listsCollection.models[i].body;

          if (data.body === inMemory) {
            return false;
          }
        }
      }
      app.post(data);
    }
  },
  createList: function createList() {
    var $barContainer = $('.active-progress'),
        $iconContainer = $('.input-container .icon-container');

    app.$noteInput.val('');
    app.$listInput.val('').focus();
    app.activeListId = null;
    app.$notesContainer.empty();
    $iconContainer.html(this.iconPlaceholderTemplate());
    $barContainer.empty();
    app.$notesContainer.attr('data-list', '');
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
    app.$listsContainer.empty();

    app.listsCollection.each(function (model) {
      var view = new RB.ListItem({ model: model });

      app.$listsContainer.append(view.render().el);
    });
  },
  setNote: function setNote(model) {
    var view = new RB.NoteItem({ model: model });

    app.$notesContainer.append(view.render().el);
    autosize(document.querySelectorAll('textarea'));
  },
  setNotes: function setNotes(id) {
    var list = app.listsCollection.get(id),
        sorted = app.sortNotes(list.attributes.notes),
        notes = new RB.Notes(sorted),
        listname = list.attributes.name,
        $iconContainer = $('.input-container .icon-container'),
        icon = list.attributes.icon ? { icon: list.attributes.icon } : { icon: 'fa fa-tasks' };

    app.$notesContainer.empty();
    app.$listInput.val(listname);
    $iconContainer.empty();
    $iconContainer.append(app.iconTemplate(icon));

    notes.each(function (note) {
      var view = new RB.NoteItem({ model: note });

      app.$notesContainer.append(view.render().el);
    });

    if (app.activeListLength === null) {
      app.activeListLength = notes.length;
    }

    app.notesCollection = notes;
    app.resetActiveList(listname);
    var listData = app.getListData(id);
    app.renderActiveProgressBar(listData);
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

    this.el.dataset.note = this.model.get('_id');
    autosize($('textarea'));

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
'use strict';

var EventHandlers = function EventHandlers(app) {

  var EVENTS = {};

  EVENTS.initializeListeners = function () {
    app.fixPath();
    app.readClient();
    app.setClient();
    app.isMobile();
    autosize(document.querySelectorAll('textarea'));
    addEvent(window, 'resize', app.setClient);
    addEvent(querySelector('.nav-avatar'), 'click', app.toggleUserDropdown);
    addEvent(querySelector('.toggle-list-btn'), 'click', app.toggleLists);
    addEvent(querySelector('.active-progress'), 'click', app.toggleProgressBarDetails);
    addEvent(querySelector('.input-container .icon-container'), 'click', app.toggleIconsContainer);
    app.setListActive();
    app.onNewIconSelect();
  };

  EVENTS.toggleLists = function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { reset: false } : arguments[0];

    var notes = document.querySelector('.notes'),
        lists = document.querySelector('.lists'),
        isListsCollapsed = lists.classList.contains('collapsed'),
        isNotesCollapsed = notes.classList.contains('collapsed'),
        isListsExpanded = lists.classList.contains('expanded'),
        isNotesExpanded = notes.classList.contains('expanded'),
        windowX = window.innerWidth;

    toggleClass(lists, 'collapsed', isListsCollapsed);
    toggleClass(lists, 'expanded', isListsExpanded);
    toggleClass(notes, 'collapsed', isNotesCollapsed);
    toggleClass(notes, 'expanded', isNotesExpanded);

    if (windowX < 600) {
      app.animateContainers();
    } else {
      app.stopAnimation();
    }
  };

  EVENTS.notify = function (notification) {
    var notifier = querySelector('.kurt-loader .message');

    notifier.innerHTML = notification;
    notifier.classList.remove('animated', 'fadeOut');
    notifier.classList.add('animated', 'fadeIn');

    setTimeout(function () {
      notifier.classList.remove('animated', 'fadeIn');
      notifier.classList.add('animated', 'fadeOut');
    }, 1000);
  };

  EVENTS.renderForms = function () {
    var container = document.querySelector('.inputs-container');

    container.innerHTML = RB.inputsTemplate();
    autosize(document.querySelectorAll('textarea'));
  };

  EVENTS.onNewIconSelect = function () {
    var nodeList = querySelectorAll('.icon-select .icon-option'),
        icons = [].slice.call(nodeList);

    for (var _iterator = icons, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var item = _ref;

      item.addEventListener('click', callback);
    }

    function callback(e) {
      var icon = this.dataset.icon,
          dropdown = document.querySelector('.icon-dropdown'),
          listId = app.activeListId;

      dropdown.classList.remove('open');
      app.updateListIcon(icon);
    };
  };

  EVENTS.appendIcons = function () {
    var container = document.querySelector('.icon-select'),
        html = '';

    for (var _iterator2 = RB.icons, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref2 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref2 = _i2.value;
      }

      var icon = _ref2;

      html = html + RB.iconItemTemplate(icon);
    }

    container.innerHTML = html;
  };

  EVENTS.toggleIconsContainer = function (e) {
    var dropdown = document.querySelector('.icon-dropdown'),
        isOpen = dropdown.classList.contains('open');

    toggleClass(dropdown, 'open', isOpen);
  };

  EVENTS.setListActive = function () {
    var nodeList = querySelectorAll('.list-item'),
        list = [].slice.call(nodeList);

    for (var _iterator3 = list, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i3 >= _iterator3.length) break;
        _ref3 = _iterator3[_i3++];
      } else {
        _i3 = _iterator3.next();
        if (_i3.done) break;
        _ref3 = _i3.value;
      }

      var item = _ref3;

      item.addEventListener('click', callback);
    }

    function callback(e) {
      for (var _iterator4 = list, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray4) {
          if (_i4 >= _iterator4.length) break;
          _ref4 = _iterator4[_i4++];
        } else {
          _i4 = _iterator4.next();
          if (_i4.done) break;
          _ref4 = _i4.value;
        }

        var item = _ref4;

        item.classList.remove('active');
      }

      this.classList.add('active');
    };
  };

  EVENTS.isMobile = function () {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (device) {
      var body = document.querySelector('body');

      body.classList.add('mobile');
    }

    return device;
  };

  EVENTS.readClient = function () {
    var windowX = window.innerWidth;

    if (app.isMobile()) {
      app.mobileClient = true;
    } else {
      app.mobileClient = false;
    }

    if (windowX < 800 && windowX > 600) {
      app.tabletClient = true;
      app.desktopClient = false;
    } else if (windowX >= 800) {
      app.tabletClient = false;
      app.desktopClient = true;
    }
  };

  EVENTS.setClient = function () {
    var notes = document.querySelector('.notes'),
        lists = document.querySelector('.lists'),
        windowX = window.innerWidth;

    if (windowX > 600) {
      notes.classList.remove('expanded', 'collapsed');
      lists.classList.remove('expanded', 'collapsed');
      app.stopAnimation();
    } else if (windowX <= 600) {
      notes.classList.add('expanded');
      lists.classList.add('collapsed');
      app.animateContainers();
    }
  };

  EVENTS.animateContainers = function () {
    var lists = document.querySelector('.lists'),
        notes = document.querySelector('.notes'),
        isListsCollapsed = lists.classList.contains('collapsed'),
        isNotesCollapsed = notes.classList.contains('collapsed'),
        isListsExpanded = lists.classList.contains('expanded'),
        isNotesExpanded = notes.classList.contains('expanded');

    if (isListsCollapsed && isNotesExpanded) {
      lists.style.marginLeft = '-39%';
      notes.style.marginRight = '0%';
    } else if (isListsExpanded && isNotesCollapsed) {
      notes.style.marginRight = '-45%';
      lists.style.marginLeft = '0%';
    }
  };

  EVENTS.stopAnimation = function () {
    var lists = document.querySelector('.lists'),
        notes = document.querySelector('.notes');

    notes.style.marginRight = '0%';
    lists.style.marginLeft = '0%';
  };

  EVENTS.toggleProgressBarDetails = function () {
    var progressBar = document.querySelector('.active-progress'),
        isShowing = !!progressBar.classList.contains('show-details');

    toggleClass(progressBar, 'show-details', isShowing);
  };

  EVENTS.toggleUserDropdown = function () {
    var dropdown = document.querySelector('.user-dd-list'),
        isOpen = !!dropdown.classList.contains('on');

    toggleClass(dropdown, 'on', isOpen);
  };

  EVENTS.fixPath = function () {
    if (window.location.hash && window.location.hash === "#_=_") {
      var _scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };

      window.location.hash = "";
      document.body.scrollTop = _scroll.top;
      document.body.scrollLeft = _scroll.left;
    }
  };

  EVENTS.hasLengthChanged = function (list) {
    if (app.activeListLength === list.length) {
      return false;
    } else {
      app.activeListLength = list.length;
      app.animateListTotal(list);

      return true;
    }
  };

  EVENTS.animateListTotal = function (list) {
    var parent = document.getElementById(list._id),
        target = parent.querySelector('.list-text'),
        isListContainer = target.dataset.length === list._id;

    if (isListContainer) {
      target.classList.remove('fadeInUp');
      target.innerHTML = list.length;
      target.classList.add('fadeOutUp');

      setTimeout(function () {
        target.classList.remove('fadeOutUp');
        target.classList.add('fadeInUp');
      }, 300);
    }
  };

  return _.extend(app, EVENTS);
};
"use strict";

var app = new RB.App();

app.start();