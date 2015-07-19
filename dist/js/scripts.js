var RAMENBUFFET = {};

RAMENBUFFET.Note = Backbone.Model.extend({
  idAttribute: '_id'
});

RAMENBUFFET.Notes = Backbone.Collection.extend({
  url: '/notes',
  model: RAMENBUFFET.Note,
  wait: true,
  comparator: 'position'
});

RAMENBUFFET.ActiveList = Backbone.View.extend({
  el: '.active-list-wrapper',
  list: null,
  inputTemplate: _.template($('#active-list-name').html()),
  initialize: function(list) {
    this.list = list;
    this.render();
  },
  events: {
    'click .create-note-btn' : 'createNote',
    'keypress .note-input'   : 'createOnEnter',
    'keyup .active-input'    : 'validate'
  },
  render: function() {
    var self = this;
    var listName;
    for (var i = 0; i < this.list.length; i++) {
      listName = {name: this.list[i].get('list')};
    }
    $('.form-list-name').html(this.inputTemplate(listName));
  },
  createOnEnter: function(e) {
    if (e.keyCode === 13) {
      this.createNote();
    }
  },
  validate: function(e) {
    var body = $('.note-input').val();
    var list = $('.list-input').val();
    if (body.trim() && list.trim() !== '') {
      $('.create-note-btn .fa').addClass('ready');
    } else {
      $('.create-note-btn .fa').removeClass('ready');
    }
  },
  createNote: function() {
    var body = $('.note-input').val();
    var list = $('.list-input').val();
    if (body.trim() && list.trim() === '') {
      return false;
    }
    if (notes.findWhere({body: body})) {
      // Prevents duplicate saves
      return false;
    }

    var note = {
        body : body,
        list : list
    };

    RAMENBUFFET.http.post(note);
  },

});
RAMENBUFFET.ActiveNote = Backbone.View.extend({
  className: 'list-item',
  itemTemplate: _.template($('#list-active-item').html()),
  initalize: function() {
    this.render();
  },
  events: {
    'click .fa-trash'     : 'clear',
    'click .fa-check'     : 'done',
    'click .fa-sort-up'   : 'moveUp',
    'click .fa-sort-down' : 'moveDown'
  },
  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));
    return this;
  },
  clear: function() {
    RAMENBUFFET.http.destroy(this.model);
  },
  done: function(e) {
    var $evt = $(e.currentTarget);
    var $selector = $evt.parent().parent();
    var note = this.model;


    if (!note.get('done')) {
      note.set({done: true});
      $selector.addClass('done');
    }
    else {
      note.set({done: false});
      $selector.removeClass('done');

    }

    RAMENBUFFET.http.put(note);
    this.render();
  },
  moveUp: function() {
    var note = this.model;
    var positionA = note.get('position');
    var listname = note.get('list');
    var list = notes.where({list: listname});
    var total = list.length;

    if (positionA !== 1) {
      var ajacent;
      var positionB;

      for (var i = 0; i < total; i++) {
          var ajacent = list[i]; // jshint ignore:line
          var positionB = ajacent.get('position'); // jshint ignore:line

        if (positionB === (positionA - 1)) {
          note.set({position: positionB});
          ajacent.set({position: positionA});


        }

      }

    RAMENBUFFET.http.put(note);
    RAMENBUFFET.http.put(ajacent);
    }


    else {

      return false;
    }

  },
  moveDown: function() {
    var self = this;
    var note = this.model;
    var position = note.get('position');
    var list = note.get('list');
    var models = notes.where({list: list});
    var total = models.length;
    if (position !== total) {
      for (var i = 0; i < total; i++) {
        if (models[i].get('position') === (position + 1)) {
          var neighbor = models[i];
          neighbor.set({position: position});
          RAMENBUFFET.http.put(self, neighbor);
        }
      }
      note.set({position: position + 1});
      RAMENBUFFET.http.put(self, note);
    } else {
      return false;
    }
  },
});
RAMENBUFFET.ListItem = Backbone.View.extend({
  className: 'menu-list list-item',
  itemTemplate: _.template($('#list-name-item').html()),
  initalize: function() {
    this.render();
  },
  render: function(list) {
    this.$el.html(this.itemTemplate(list));
    this.$el.attr('data-id', list.name);
    return this;
  },
});
RAMENBUFFET.App = Backbone.View.extend({

  el: '.dmc',

  initialize: function() {
    var self = this;

    RAMENBUFFET.http.get();
  },

  events: {
    'click .create-list-btn'     : 'newList',
    'click .menu-list.list-item' : 'select'
  },

  select: function(e) {
    var $listname = $(e.currentTarget).data('id');

    RAMENBUFFET.fn.selectList($listname);

    return this;
  },

  newList: function() {
    $('.active-notes-container').empty();
    $('.list-input').val('');
    $('.list-input').focus();
    var activeList = new RAMENBUFFET.ActiveList();
  }
});
RAMENBUFFET.e = {
  init: function() {
    this.fixPath();
  },
  notify: function(notification) {
    var $loader = $('.kurt-loader');
    var icon = '<i class="fa fa-asterisk"></i>';
    var message = '<p class="notification thin-lg animated fadeIn">' + icon + ' ' + notification + '</p>';
    $loader.html(message);
    var $notification = $('.notification');
    setTimeout(function() {
      $notification.removeClass('fadeIn');
      $notification.addClass('fadeOut');
    }, 1200);

  },
  fixPath: function() {
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
};
RAMENBUFFET.fn = {

  selectList: function(listname) {
    RAMENBUFFET.fn.setActive(listname);

    return this;
  },

  setLists: function(collection) {
    var $lists = $('.lists-container');
    var array = [];

    $lists.empty();

    collection.each(function(model) {
      var list = model.get('list');

      if (array.indexOf(list) === -1) {
        array.push(list);
      }

    });

    for (var i = 0; i < array.length; i++) {
      var listname = array[i];
      var total = collection.where({list: listname}).length;
      var view = new RAMENBUFFET.ListItem();

      view.render({
        name: listname,
        length: total
      });

      $lists.append(view.el);
    }

    return this;
  },

  setActive: function(listname) {
    var $notes = $('.active-notes-container');
    var models = notes.where({list: listname});
    var active = new RAMENBUFFET.ActiveList(models);

    var listModels = new RAMENBUFFET.Notes(models);
    for (var i = 0; i < listModels.length; i++) {
      var listedNote = listModels.models[i].set({position: i + 1});

    }

    $notes.empty();
    for (var j = 0; j < listModels.length; j++) {
      var view = new RAMENBUFFET.ActiveNote({model: listModels.models[j]});
      view.render();
      $notes.append(view.el);
    }

    return this;
  },

  convertDate: function(date) {
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
  },

};
RAMENBUFFET.http = {

  get: function(callback) {

    notes.fetch({

      success: function(data) {
        var listname = "New List";

        RAMENBUFFET.fn.setLists(data);
        RAMENBUFFET.fn.setActive(listname);

        return data;
      },

      error: function(err) {
        return RAMENBUFFET.e.notify(err);
      }

    });

  },

  post: function(model) {
    var listname = model.list;
    var created    = Date.now();
    var timestamp  = RAMENBUFFET.fn.convertDate(created);
    var total = notes.where({list: listname}).length;
    var note = notes.create({
        body      : model.body,
        list      : listname,
        created   : created,
        timestamp : timestamp,
        position  : total + 1
    });
    var view = new RAMENBUFFET.ActiveNote({model: note});
    view.render();
    $('.active-notes-container').append(view.el);
    RAMENBUFFET.fn.setLists(notes);
    RAMENBUFFET.e.notify('Note added');

  },

  put: function(model) {
    var note = model;
    var listname = model.get('list');

    console.log(note);
    $.ajax({
      type: 'PUT',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      dataType: 'JSON',
      success: function(data) {
        RAMENBUFFET.e.notify('Note updated');
        console.log('Ajaxing ', data);
        RAMENBUFFET.fn.setActive(listname);
      },
      error: function(err) {
        RAMENBUFFET.e.notify(err);
      }
    });
  },

  destroy: function(model) {
    model.destroy({
      success: function(model, response) {
        notes.remove(model);
        RAMENBUFFET.e.notify('Note deleted');
        console.log(response);
      },
      error: function(err) {
        RAMENBUFFET.e.notify(err);
        console.log(err);
      }
    });
  },
};
RAMENBUFFET.lists = {
  init: function() {
    this.setActiveList();
    this.collapseLists();
    this.expandLists();
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
var notes = new RAMENBUFFET.Notes();
var wrapper = new RAMENBUFFET.App({collection: notes});

RAMENBUFFET.init = function() {
    RAMENBUFFET.lists.init();
    RAMENBUFFET.e.init();
    new WOW().init();
};

$(document).ready(function() {
  RAMENBUFFET.init();
});