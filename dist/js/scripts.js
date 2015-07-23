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
RB.all = function() {
  var notes = new RB.Notes();

  notes.fetch({

    success: function(collection) {
      console.log(collection);
      var app = new RB.App({collection: collection});
      RB.collection = collection;
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

RB.returnVal = function(value) {
  return value;
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
    var inputs = new RB.Input();

    $listsContainer.append(template({
      name: lists[i],
      length: listObjects.length}));
  }

};

RB.setNotes = function(selector, models) {
  var listname;

  if (models.length > 0) {
    listname = models[0].get('list');
  }
  else {
    listname = '';
  }

  $('.active-input.list-input').val(listname);
  $selector = RB.tojquery(selector);
  $selector.empty();

  for (var i = 0; i < models.length; i++) {
    var note = models[i];
    var view = new RB.NoteItem({model: note});

    $selector.append(view.render().el);
  }

  RB.resetActiveList(listname);

};

RB.notify = function(notification) {
  var $loader = $('.kurt-loader');
  var icon = '<i class="fa fa-bell-o"></i>';
  var message = '<p class="notification thin-lg animated fadeIn">' + icon + ' ' + notification + '</p>';

  $loader.html(message);
  setTimeout(function() {
    $('.notification').removeClass('animated fadeIn');
    $('.notification').addClass('animated fadeOut');
  }, 1200);

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
  var date = Date.now();
  var timestamp = RB.convertDate(date);
  var notes = RB.collection;
  var note = {
    body: $('.note-input').val(),
    list: $('.list-input').val(),
    created: date,
    timestamp: timestamp,
    done: false
  };

  if (notes.findWhere({body: note.body}) && notes.findWhere({list: note.list})) {
    return false;
  }

  var saved = notes.create(note);
  return saved;

};

RB.put = function(model) {
  var list = model.get('list');
  var notes = RB.collection;

  model.save(null, {
    success: function(data) {
      notes.set(data);
      RB.reset(list);
      RB.notify('Updated');
    }

  });
};

RB.destroy = function(model) {
  var list = model.get('list');

  model.destroy({
    success: function(model) {
      RB.reset(list);
      RB.notify('Note deleted');
    },
    error: function(err) {
      RB.reset(list);
      RB.notify('Removed');
    }
  });
};
RB.e = {
  init: function() {
    RB.e.setActiveList();
    RB.e.collapseLists();
    RB.e.expandLists();
  },
  setActiveList: function() {
    $(document).on('click', '.lists-container .list-item', function() {
      $('.list-item').removeClass('active');
      $(this).addClass('active');
    });
  },
  collapseLists: function() {
    $(document).on('click', '.toggle-list-btn.close-list', function() {
      var $lists = $('.lists-container');
      var $open = $('.toggle-list-btn.open-list');
      var $close = $('.toggle-list-btn.close-list');
      $close.addClass('hidden');
      $open.removeClass('hidden');
      $lists.slideToggle('fast');
    });
  },
  expandLists: function() {
    $(document).on('click', '.toggle-list-btn.open-list', function() {
      var $lists = $('.lists-container');
      var $open = $('.toggle-list-btn.open-list');
      var $close = $('.toggle-list-btn.close-list');
      $close.removeClass('hidden');
      $open.addClass('hidden');
      $lists.slideToggle('fast');
    });
  }
};
RB.init = function() {
  RB.fixPath();
  RB.all();
  RB.e.init();
};
RB.App = Backbone.View.extend({

  el: '.dmc',

  initialize: function() {
    this.render();
  },

  events: {
    'click .lists-container .list-item' : 'renderList'
  },

  render: function() {
    var lists = RB.getLists(this.collection);

    RB.setLists(this.collection, lists);
  },

  renderList: function(e) {
    var listname = $(e.currentTarget).data('id');
    var notes = this.collection.where({list: listname});

    RB.setNotes('.active-notes-container', notes);
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
    'keyup .active-input'    : 'validate',
    'click .create-list-btn' : 'createList'
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
    var body = $('.note-input').val();
    var list = $('.list-input').val();

    if (body.trim() && list.trim() !== '') {
      $('.create-note-btn .fa').addClass('ready');
    }
    else {
      $('.create-note-btn .fa').removeClass('ready');
    }

  },

  createNote: function() {
    var body = $('.note-input').val();
    var list = $('.list-input').val();

    if (body.trim() && list.trim() !== '') {
      RB.post();
      RB.reset(list);
    }

  },

  createList: function() {
    var $notesContainer = $('.active-notes-container');

    $notesContainer.empty();
    RB.reset('');
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
    'click .edit .fa-check-circle' : 'toggleDone'
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