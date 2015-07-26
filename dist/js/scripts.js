var RB = {};

RB.Note = Backbone.Model.extend({
  idAttribute: '_id',
});

RB.Notes = Backbone.Collection.extend({
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

      RB.setLists(lists);
      RB.input = new RB.Input();
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

RB.getLists = function() {
  var arr = [];

  RB.collection.each(function(model) {
    var listname = model.get('list');

    if (arr.indexOf(listname) === -1) {
      arr.push(listname);
    }

  });

  return arr;
};

RB.setLists = function(array) {
  var lists = array;
  var template = _.template($('#list-name-template').html());
  var $listsContainer = $('.lists-container');

  $listsContainer.empty();

  for (var i = 0; i < lists.length; i++) {
    var total = RB.collection.where({list: lists[i], done: false}).length;

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

  }
  else {
    $listInput.val('');
    $noteInput.val('');
    $notesContainer.empty();


  }

  if (!RB.e.isMobile()) {
    $noteInput.focus();
  }

};

RB.setNote = function(model) {
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

RB.setListValue = function(listname) {
  var $listInput = $('.active-input.list-input');
  var inputs = new RB.Input();

  $listInput.val(listname);
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
  var id = model.get('_id');

  model.save(null, {
    url: '/notes/' + id,
    success: function(data) {

      console.log(data.attributes.done);
      RB.collection.set(data);
      RB.notify('Updated');

    }

  });
};

RB.destroy = function(model) {
  var listname = model.get('list');
  var id = model.get('_id');

  if (id !== null) {

    model.destroy({
      wait: true,
      url: '/notes/' + id,
      dataType: 'text',
      data: {_id: id},
      success: function(model) {

        RB.notify('Note deleted');
        console.log('success ', model);

      },
      error: function(err) {
        RB.notify('Removed');
        console.log('error ', err);

      },
    });

  }
};
RB.e = {

  init: function() {
    RB.e.setActiveList();
    RB.e.deviceEnv(800);
    RB.e.sunny();

    $(document).on('click', '.toggle-list-btn', function() {
      RB.e.toggleLists();
     });

    $(document).on('listSelected', function() {
      RB.e.garbageWatcher();
    });

    $(document).on('listChanged', function() {
      RB.e.listWatcher();
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
      $(document).trigger('listSelected');
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

  },

  garbageWatcher: function() {
    var activeList = document.getElementsByClassName('list-item active');
    var listname = $(activeList).prop('dataset').id;
    var number = RB.collection.where({list: listname, done: true}).length;

    RB.e.appendDoneStats(number);

  },

  appendDoneStats: function(number) {
    var $garbageContainer = $('.garbage-container');
    var $statContainer = $('.garbage-container .stat');
    var $trashContainer = $('.garbage-container .edit');
    var garbageTemplate = _.template($('#garbage-watcher-template').html());
    var sunnyTemplate = _.template($('#sunny-template').html());

    console.log(number);
    if (number !== 0) {
      $garbageContainer.html(garbageTemplate({length: number}));

    }
    else {
      $garbageContainer.html(sunnyTemplate());

    }
  },

  listWatcher: function() {
    var template = _.template($('#list-name-template').html());
    var $listsContainer = $('.lists-container');
    var activeList = document.getElementsByClassName('list-item active');
    var listname = $(activeList).prop('dataset').id;
    var number = RB.collection.where({list: listname, done: false}).length;

    $(activeList).remove();

    $listsContainer.append(template({
        name: listname,
        length: number}));

  },

  sunny: function() {
    var counter = 0;

    setInterval(function() {
      $('.fa.fa-certificate').css({'-ms-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-moz-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-o-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-webkit-transform': 'rotate(' + counter + 'deg)'})
                       .css({'transform': 'rotate(' + counter + 'deg)'});
      counter += 3;
    }, 100);
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
    console.log('we initing');
  },

  events: {
    'click .create-note-btn'   : 'createNote',
    'keyup .note-input'        : 'createOnEnter',
    'keyup .active-input'      : 'validate',
    'click .garbage-container' : 'removeAllDone'
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

  removeAllDone: function() {
    var listname = $('.list-input').val();
    var models = RB.collection.where({
      list: listname,
      done: true
    });

    console.log(models.length);

    for (var i = 0; i < models.length; i++) {
      RB.destroy(models[i]);
    }

    var remaining = RB.collection.where({
      list: listname
    });

    console.log(remaining);
    if (remaining) {
      RB.setListValue(listname);

    }
    else {
      $noteInput.val('');
      $listInput.val('').focus();
      $notesContainer.empty();

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
    $(document).trigger('listSelected');
    $(document).trigger('listChanged');
    this.remove();
  },

  toggleDone: function() {
    var note = this.model;
    var isDone = note.get('done');
    var self = this;
    var parity = !isDone;

    var attr = {done: parity};
    console.log(note);
    note.save(attr, {
      success: function(model, response) {
        $(document).trigger('listSelected');
        $(document).trigger('listChanged');
        RB.collection.set(model);
        self.render({model: model});
        console.log(model, response);
      },
      error: function(err) {
        console.log(err);
      }
    });
  },

});
RB.init();