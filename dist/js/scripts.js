var RB = {};

RB.Note = Backbone.Model.extend({
  idAttribute: '_id',
});

RB.Notes = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
  merge: true,
});

RB.List = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
  merge: true,
});
RB.init = function() {
  RB.fixPath();
  var app = new RB.App();
  RB.get();
  RB.e.init();
};

RB.get = function() {
  var notes = new RB.Notes();

  notes.fetch({

    success: function(collection) {
      RB.collection = collection;
      var lists = RB.getLists(RB.collection);

      RB.setLists(RB.collection, lists);

    },
    error: function(err) {
      console.log(err);
    }

  });
};

RB.reset = function(listname) {
  var notes = RB.collection;
  notes.fetch({

    success: function(collection) {
      var lists = RB.getLists(collection);
      var notes = collection.where({list: listname});

      RB.setLists(collection, lists);
      RB.setNotes('.active-notes-container', notes);

    },
    error: function(err) {
      console.log(err);
    }

  });
};

RB.getLists = function(collection) {
  var arr = [];

  collection.each(function(model) {
    var listname = model.get('list');

    if (arr.indexOf(listname) === -1) {
      arr.push(listname);
    }

  });

  return arr;
};

RB.setLists = function(collection, array) {
  var lists = array;
  var template = _.template($('#list-name-template').html());
  var $listsContainer = $('.lists-container');

  $listsContainer.empty();

  for (var i = 0; i < lists.length; i++) {
    var listObjects = collection.where({list: lists[i]});
    var total = collection.where({list: lists[i], done: false}).length;
    var inputs = new RB.Input();

    $listsContainer.append(template({
      name: lists[i],
      length: total}));
  }

};

RB.setNotes = function(selector, models) {
  var $notesContainer = $('.active-notes-container');
  var $listInput = $('.active-input.list-input');
  var $noteInput = $('.active-input.note-input');

  if (models.length > 0) {
    var listname = models[0].get('list');

    $listInput.val(listname);
    $selector = RB.tojquery(selector);
    $selector.empty();

    for (var i = 0; i < models.length; i++) {
      var note = models[i];
      var view = new RB.NoteItem({model: note});

      $selector.append(view.render().el);
    }

    RB.resetActiveList(listname);

    if (!RB.e.isMobile()) {
      $noteInput.focus();
    }

  }
  else {
    $listInput.val('');
    $noteInput.val('');
    $notesContainer.empty();

    if (!RB.e.isMobile()) {
      $noteInput.focus();
    }

  }

};

RB.setNote = function(model) {
  console.log(model);
  var $notesContainer = $('.active-notes-container');
  var view = new RB.NoteItem({model: model});
  $notesContainer.append(view.render().el);
};

RB.notify = function(notification) {
  var $loader = $('.kurt-loader');

};

RB.fixPath = function() {

  if (window.location.hash && window.location.hash === "#_=_") {
    var scroll = {
      top: document.body.scrollTop,
      left: document.body.scrollLeft
    };

    window.location.hash = "";
    document.body.scrollTop = scroll.top;
    document.body.scrollLeft = scroll.left;

  }

};

RB.tojquery = function(element) {

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
  }

};

RB.convertDate = function(date) {
  var d = new Date(date);
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var min = minutes > 10 ? minutes : ('0' + minutes);
  var meridiem = hours >= 12 ? 'PM' : 'AM';
  var hour = hours > 12 ? hours - 12 : hours;
  month = ('' + (month + 1)).slice(-2);
  var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;

  return timestamp;
};

RB.resetActiveList = function(listname) {
  var $element = $('div').find("[data-id='" + listname + "']");

  $element.addClass('active');
};
RB.post = function() {
  var $noteInput = $('.note-input');
  var listname = $('.list-input').val();
  var date = Date.now();
  var timestamp = RB.convertDate(date);

  var note = {
    body: $noteInput.val(),
    list: listname,
    created: date,
    timestamp: timestamp,
    done: false
  };

  if (RB.collection.findWhere({body: note.body}) && RB.collection.findWhere({list: note.list})) {
    return false;
  }

  RB.collection.create(note, {

    success: function(data) {
      RB.setNote(data);
      RB.reset(listname);
      $noteInput.focus();

    },
    error: function(err) {
      console.log(err);
    }

  });

};

RB.put = function(model) {
  var listname = model.get('list');

  model.save(null, {

    success: function(data) {
      RB.collection.set(data);
      RB.reset(listname);
      RB.notify('Updated');

    }

  });
};

RB.destroy = function(model) {
  var listname = model.get('list');

  model.destroy({

    success: function(model) {
      RB.reset(listname);
      RB.notify('Note deleted');

    },
    error: function(err) {
      RB.reset(listname);
      RB.notify('Removed');

    }

  });
};
RB.e = {

  init: function() {
    RB.e.setActiveList();
    RB.e.deviceEnv(800);

    $(document).on('click', '.toggle-list-btn', function() {
      RB.e.toggleLists();
     });
  },

  deviceEnv: function(num) {

    if (RB.e.isMobile()) {
      setTimeout(RB.e.toggleLists, num);
    }

  },

  setActiveList: function() {
    $(document).on('click', '.lists-container .list-item', function() {
      var $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
    });
  },

  toggleLists: function() {
    var $listsContainer = $('.lists-container');
    var $icon = $('.toggle-list-btn .fa');

    $listsContainer.slideToggle('fast');
    $icon.toggleClass('collapsed');
  },

  isMobile: function() {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return device;

  }

};
RB.App = Backbone.View.extend({

  el: '.dmc',

  events: {
    'click .lists-container .list-item' : 'renderList',
    'click .create-list-btn' : 'createList'
  },

  renderList: function(e) {
    var listname = $(e.currentTarget).data('id');
    var notes = RB.collection.where({list: listname});

    RB.setNotes('.active-notes-container', notes);

    RB.e.deviceEnv(400);

  },

  createList: function() {
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $notesContainer = $('.active-notes-container');

    $noteInput.val('');
    $listInput.val('').focus();
    $notesContainer.empty();
  },

});
RB.Input = Backbone.View.extend({

  el: '.active-list-container',

  inputTemplate: _.template($('#input-template').html()),

  initialize: function() {
    this.render();
  },

  events: {
    'click .create-note-btn' : 'createNote',
    'keyup .note-input'      : 'createOnEnter',
    'keyup .active-input'    : 'validate'
  },

  render: function() {
    $('.active-list-container').html(this.inputTemplate());

    return this;
  },

  createOnEnter: function(e) {
    if (e.keyCode === 13) {
      this.createNote();
    }
  },

  validate: function() {
    var $body = $('.note-input').val();
    var $list = $('.list-input').val();
    var $check = $('.create-note-btn .fa');

    if ($body.trim() && $list.trim() !== '') {
      $check.addClass('ready');
    }
    else {
      $check.removeClass('ready');
    }

  },

  createNote: function() {
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $body = $noteInput.val();
    var $list = $listInput.val();

    if ($body.trim() && $list.trim() !== '') {
      RB.post();
    }

  },

});
RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),

  initalize: function() {
    this.render();
  },

  events: {
    'click .edit .fa-trash'        : 'destroyNote',
    'click .edit .fa-check-square' : 'toggleDone'
  },

  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  },

  destroyNote: function() {
    RB.destroy(this.model);
  },

  toggleDone: function() {
    var note = this.model;
    var isDone = note.get('done');

    if (isDone) {
      note.set({done: false});
    }
    else {
      note.set({done: true});
    }

    RB.put(note);
  },

});
RB.init();