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
    this.helpers.init(this);

    var user = new RB.User();

    user.fetch({

      success: function success(model, response) {
        if (app.user === null) {
          app.user = model;
        }

        if (app.listsCollection === null) {
          app.listsCollection = new RB.Lists(model.attributes.lists);
          var lists = app.getListNames(app.listsCollection);
          app.setLists(lists);
        }

        return app.listsCollection;
      },
      error: function error(err) {
        console.log(err);
      }

    });
  },

  post: function post(model) {
    var $noteInput = $('.note-input');
    var $notesContainer = $('.active-notes-container');

    $.ajax({
      url: '/notes/',
      method: 'POST',
      data: model,
      success: function success(model, response) {
        console.log(model);
        $noteInput.val('').focus();
        app.validate();
        var note = new RB.Note(model);
        var view = new RB.NoteItem({ model: note });
        $notesContainer.append(view.render().el);
        view.notify('Created');
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  put: function put(model, attributes, view) {
    var self = this,
        id = model.get('_id');

    model.save(attributes, {

      url: '/notes/' + id,
      success: function success(model, response) {
        self.notify('Updated');
        self.onChangeListeners();
        view.render();
      },
      error: function error(_error) {
        console.log('error ', _error);
      }
    });
  },

  destroy: function destroy(model) {
    var self = this,
        id = model.get('_id'),
        listId = self.getActiveListId();

    model.set('listId', listId);

    if (id !== null) {

      model.destroy({
        url: '/notes/' + id + '?listId=' + listId,
        success: function success(model, response) {
          console.log('success ', model);
          self.notify('Removed');
        },
        error: function error(err) {
          console.log('error ', err);
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

  garbageTemplate: _.template($('#garbage-watcher-template').html()),
  allDoneTemplate: _.template($('#sunny-template').html()),

  getNotesByListname: function getNotesByListname(listname) {
    var notes = app.listsCollection.where({ name: listname });

    return notes;
  },

  getListNames: function getListNames() {
    var self = this;
    var array = [];

    app.listsCollection.each(function (model) {
      array.push(model.get('name'));
    });

    return array;
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
    var $notesContainer = $('.active-notes-container');
    var view = new RB.NoteItem({ model: model });

    $notesContainer.append(view.render().el);
  },

  setNotes: function setNotes(id) {
    var list = app.listsCollection.get(id),
        notes = new RB.Notes(list.attributes.notes),
        listname = list.attributes.name,
        $container = $('.active-notes-container'),
        $listInput = $('.active-input.list-input'),
        $noteInput = $('.active-input.note-input');

    $container.empty();
    $listInput.val(listname);

    notes.each(function (note) {
      var view = new RB.NoteItem({ model: note });

      $container.append(view.render().el);
    });

    app.notesCollection = notes;
    this.resetActiveList(listname);
    console.log(app.notesCollection);
  },

  getActiveListId: function getActiveListId() {
    var id = app.activeListId;

    return id;
  },

  setActiveListId: function setActiveListId(id) {
    var $container = $('.active-notes-container');

    $container.attr('data-list', id);
    app.activeListId = id;

    return this;
  },

  setListValue: function setListValue(listname) {
    var $listInput = $('.active-input.list-input');
    $listInput.val(listname);
  },

  resetActiveList: function resetActiveList(listname) {
    var $listItem = $('.list-item');
    var $element = $('div').find("[data-id='" + listname + "']");

    $listItem.removeClass('active');
    $element.addClass('active');

    return $element;
  },

  getListnameContainer: function getListnameContainer(listname) {
    var $element = $('div').find("[data-id='" + listname + "']");

    return $element;
  }

});
// ===================
// Helpers
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  helpers: {
    init: function init(self) {
      self.fixPath();
      self.onClickSetActive();
      self.deviceEnv(800);
    }
  },

  notify: function notify(notification) {
    var $loader = $('.kurt-loader');
    $loader.html('<p class="thin-sm animated fadeIn">' + notification + '</p>');
    var $text = $loader.find('.thin-sm');

    setTimeout(function () {
      $text.removeClass('animated fadeIn');
      $text.addClass('animated fadeOut');
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
    }
  },

  convertDate: function convertDate(date) {
    var d = new Date(date);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var min = minutes > 10 ? minutes : '0' + minutes;
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    var hour = hours > 12 ? hours - 12 : hours;
    month = ('' + (month + 1)).slice(-2);
    var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;

    return timestamp;
  },

  // ===================
  // DOM & Device Helpers
  // ===================

  deviceEnv: function deviceEnv(num) {
    if (this.isMobile()) {
      setTimeout(this.toggleLists, num);
    }
  },

  setFirstChildActive: function setFirstChildActive() {
    var listItem = $('.lists-container').first();

    listItem.addClass('active');
  },

  onClickSetActive: function onClickSetActive() {
    $(document).on('click', '.lists-container .list-item', function () {
      var $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
      $(document).trigger('listSelected');
    });
  },

  toggleLists: function toggleLists() {
    var $listsContainer = $('.lists-container');
    var $icon = $('.toggle-list-btn .fa');

    $listsContainer.slideToggle('fast');
    $icon.toggleClass('collapsed');
  },

  isMobile: function isMobile() {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return device;
  },

  onChangeListeners: function onChangeListeners() {
    var numberDone = this.garbageWatcher();
    this.appendDoneStats(numberDone);
  },

  garbageWatcher: function garbageWatcher() {
    var number = app.listsCollection.length;
    console.log(number);

    return number;
  },

  appendDoneStats: function appendDoneStats(number) {
    var $garbageContainer = $('.garbage-container');
    var $statContainer = $('.garbage-container .stat');
    var $trashContainer = $('.garbage-container .edit');

    if (number !== 0) {
      $garbageContainer.html(this.garbageTemplate({ length: number }));
    } else {
      $garbageContainer.html(this.allDoneTemplate());
    }

    return this;
  },

  sunny: function sunny() {
    var counter = 0;

    setInterval(function () {
      $('.fa.fa-certificate').css({ '-ms-transform': 'rotate(' + counter + 'deg)' }).css({ '-moz-transform': 'rotate(' + counter + 'deg)' }).css({ '-o-transform': 'rotate(' + counter + 'deg)' }).css({ '-webkit-transform': 'rotate(' + counter + 'deg)' }).css({ 'transform': 'rotate(' + counter + 'deg)' });
      counter += 3;
    }, 100);
  },

  fixPath: function fixPath() {

    if (window.location.hash && window.location.hash === "#_=_") {
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };

      window.location.hash = "";
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
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

  initialize: function initialize() {
    this.renderInputFields();
  },

  events: {
    'click .create-list-btn': 'createList',
    'click .toggle-list-btn': 'toggleLists',
    'click .create-note-btn': 'createNote',
    'keyup .note-input': 'createOnEnter',
    'keyup .active-input': 'validate'
    // 'click .garbage-container'          : 'removeAllDone',
    // 'focus .list-input'                 : 'isMakingNewList',
    // 'keyup .list-input'                 : 'compareListValue'
  },

  // grabValueSnapshot: function() {

  //   if (this.isListSelected) {
  //     var listname = $('.list-input').val();

  //     return listname;
  //   }

  // },

  // isMakingNewList: function() {
  //   var listnamesArray = this.getLists();
  //   var listname = this.grabValueSnapshot();

  //   if (listname) {
  //     this.currentList = listname;
  //     this.allLists = listnamesArray;
  //   }
  //   else {

  //     return false;
  //   }

  // },

  // compareListValue: function() {
  //   var typing = $('.list-input').val();
  //   var $activeNotes = $('.active-notes-container');

  //   if (typing !== this.currentList) {
  //     $activeNotes.hide();
  //     this.checkMatchingLists(typing);

  //   }
  //   else {

  //     $activeNotes.show();
  //   }

  // },

  // checkMatchingLists: function(string) {
  //   var $notesContainer = $('.active-notes-container');
  //   var notes;

  //   for (var i = 0; i < this.allLists.length; i++) {

  //     if (string === this.allLists[i]) {

  //       notes = this.getNotesByListname(string);
  //       this.setNotes($notesContainer, notes);
  //       $notesContainer.show();

  //     }
  //   }
  // },

  createList: function createList() {
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $notesContainer = $('.active-notes-container');

    $noteInput.val('');
    $listInput.val('').focus();
    $notesContainer.empty();
    this.onChangeListeners();
  },

  renderInputFields: function renderInputFields() {
    $('.active-list-container').html(this.inputTemplate());

    return this;
  },

  createOnEnter: function createOnEnter(e) {
    if (e.keyCode === 13) {
      this.createNote();
    }
  },

  validate: function validate() {
    var $body = $('.note-input').val();
    var $list = $('.list-input').val();
    var $check = $('.create-note-btn .fa');

    if ($body.trim() && $list.trim() !== '') {
      $check.addClass('ready');
    } else {
      $check.removeClass('ready');
    }
  },

  createNote: function createNote() {
    var body = $('.note-input').val(),
        list = $('.list-input').val();

    if (body.trim() && list.trim() !== '') {

      var note = {
        body: body,
        list: list,
        done: false
      };

      if (app.listsCollection.length > 0) {

        for (var i = 0; i < app.listsCollection.length; i++) {
          var inMemory = app.listsCollection.models[i].body;

          if (note.body === inMemory) {
            return false;
          }
        }
      }

      this.post(note);
    }
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
    this.deviceEnv(400);
  }

});
'use strict';

RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

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
    this.destroy(this.model);
    this.remove();
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