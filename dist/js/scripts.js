var RAMENBUFFET = {};

RAMENBUFFET.Note = Backbone.Model.extend({
  idAttribute: '_id'
});

RAMENBUFFET.Notes = Backbone.Collection.extend({
  url: '/notes',
  model: RAMENBUFFET.Note
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
    var self = this;
    var body = $('.note-input').val();
    var list = $('.list-input').val();
    if (body === '' || list === '') {
      return false;
    }
    if (wrapper.collection.findWhere({body: body})) {
      // Prevents duplicate saves
      return false;
    }
    var created = Date.now();
    var timestamp = this.convertDate(created);
    var numOfNotes = wrapper.collection.where({list: list}).length;
    console.log(numOfNotes);
    var position = numOfNotes + 1;
    var note = {
        body      : body,
        list      : list,
        created   : created,
        timestamp : timestamp,
        position  : position
    };
    RAMENBUFFET.http.post(self, note);
  },
  convertDate: function(date) {
    var d = new Date(date);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var min = minutes > 10 ? ('0' + minutes) : minutes;
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    var hour = hours > 12 ? hours - 12 : hours;
    month = ('' + (month + 1)).slice(-2);
    var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;
    return timestamp;
  },
});
RAMENBUFFET.ActiveNote = Backbone.View.extend({
  className: 'list-item wow fadeIn animated',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-trash'     : 'clear',
    'click .fa-check'     : 'put',
    'click .fa-sort-up'   : 'moveUp',
    'click .fa-sort-down' : 'moveDown'
  },
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  clear: function() {
    var self = this;
    var note = this.model;
    RAMENBUFFET.http.destroy(self, note);
  },
  put: function(e) {
    var $evt = $(e.currentTarget);
    var self = this;
    var note = this.model;
    if (!note.get('done')) {
      $evt.parent().parent().addClass('done');
      note.set({done: true});
    } else {
      $evt.parent().parent().removeClass('done');
      note.set({done: false});
    }
    RAMENBUFFET.http.put(self, note);
    this.render();
  },
  moveUp: function() {
    var self = this;
    var note = this.model;
    var position = note.get('position');
    var list = note.get('list');
    var models = wrapper.collection.where({list: list});
    var total = models.length;
    if (position !== 1 || 0) {
      for (var i = 0; i < total; i++) {
        if (models[i].get('position') === (position - 1)) {
          var neighbor = models[i];
          neighbor.set({position: position});
          RAMENBUFFET.http.put(self, neighbor);
        }
      }
      note.set({position: position - 1});
      RAMENBUFFET.http.put(self, note);
    } else {
      return false;
    }
  },
  moveDown: function() {
    var self = this;
    var note = this.model;
    var position = note.get('position');
    var list = note.get('list');
    var models = wrapper.collection.where({list: list});
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
RAMENBUFFET.Wrapper = Backbone.View.extend({
  el: '.dmc',
  initialize: function() {
    var self = this;
    this.collection = new RAMENBUFFET.Notes();
    this.collection.fetch({
      success: function(data) {
        console.log('fetch ', data);
        self.setLists();
        self.setActive();
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
    this.listenTo(this.collection, 'all', this.setLists);
  },
  events: {
    'click .create-list-btn' : 'newList',
    'click .menu-list.list-item' : 'select'
  },
  select: function(e) {
    console.log(e);
    var $listName = $(e.currentTarget).data('id');
    this.setActive($listName);
    return this;
  },
  setLists: function() {
    $('.lists-container').empty();
    var self = this;
    var a = [];
    this.collection.each(function(model) {
      var list = model.get('list');
      if (a.indexOf(list) === -1) {
        a.push(list);
      }
    });
    for (var i = 0; i < a.length; i++) {
      var name = a[i];
      var total = self.collection.where({list: a[i]}).length;
      var view = new RAMENBUFFET.ListItem();
      view.render({name: name, length: total});
      $('.lists-container').append(view.el);
    }
    return this;
  },
  setActive: function(listName) {
    $('.active-notes-container').empty();
    var active = this.collection.where({list: listName});
    var activeList = new RAMENBUFFET.ActiveList(active);
    for (var i = 0; i < active.length; i++) {
      var view = new RAMENBUFFET.ActiveNote({model: active[i]});
      view.render();
      $('.active-notes-container').append(view.el);
    }
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
    var icon = '<i class="fa fa-bolt"></i>';
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
RAMENBUFFET.http = {
  post: function(cxt, model) {
    var self = cxt;
    var note = model;
    wrapper.collection.create(note, {
      success: function(data) {
        var view = new RAMENBUFFET.ActiveNote({model: data});
        view.render();
        $('.active-notes-container').append(view.el);
        var message = "Note added";
        RAMENBUFFET.e.notify(message);
        $('.note-input').val('');
      },
      error: function(err) {
        var message = "Error creating note";
        RAMENBUFFET.e.notify(message);
      }
    });
  },
  put: function(cxt, model) {
    var self = cxt;
    var note = model;
    $.ajax({
      type: 'PUT',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      dataType: 'JSON',
      success: function(data) {
        var message = "Note updated";
        RAMENBUFFET.e.notify(message);
        console.log(data);
      },
      error: function(err) {
        var message = "Error updating note";
        RAMENBUFFET.e.notify(message);
        console.log(err);
      }
    });
  },
  destroy: function(cxt, model) {
    var self = cxt;
    var note = model;
    $.ajax({
      type: 'DELETE',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      success: function(data) {
        wrapper.collection.remove(note.get('_id'));
        self.remove();
        var message = "Note deleted";
        RAMENBUFFET.e.notify(message);
      },
      error: function(err) {
        self.remove();
        var message = "Error deleting note";
        RAMENBUFFET.e.notify(message);
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
var wrapper = new RAMENBUFFET.Wrapper();


RAMENBUFFET.init = function() {
    RAMENBUFFET.lists.init();
    RAMENBUFFET.e.init();
    new WOW().init();
};

$(document).ready(function() {
  RAMENBUFFET.init();
});