var ListName = Backbone.Model.extend({});
var Note = Backbone.Model.extend({
  idAttribute: '_id'
});
var User = Backbone.Model.extend({});
var Notes = Backbone.Collection.extend({
  url: '/notes',
  model: Note
});
var ActiveList = Backbone.View.extend({
  el: '.active-list-container',
  inputTemplate: _.template($('#active-input').html()),
  list: null,
  initialize: function(list) {
    if (!list) {
      var listName = this.collection.models[length - 1].get('list');
      this.switchList(listName);
    } else {
      this.switchList(list.name);
    }
  },
  events: {
    'click .create-note-btn' : 'createNote',
    'keypress .note-input'   : 'createOnEnter',
    'keyup .active-input'    : 'elluminateBtn'
  },
  switchList: function(list) {
    $('.active-notes').empty();
    var self = this;
    var listName = {name: list};
    $('.active-list').html(this.inputTemplate(listName));
    this.collection.each(function(model) {
      if (model.get('list') === list) {
        var timestamp = self.convertDate(new Date(model.get('created')));
        var m = model.set({timestamp: timestamp});
        var view = new NoteItem({model: m});
        view.render();
        $('.active-notes').append(view.el);
      }
    });
  },
  createOnEnter: function(e) {
    if (e.keyCode === 13) {
      this.createNote();
    }
  },
  elluminateBtn: function(e) {
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
    var note;
    note = notes.create({
      body: body,
      list: list
    }, 
    {
      success: function() {
        var timestamp = self.convertDate(new Date(note.get('created')));
        var m = note.set({timestamp: timestamp});
        var view = new NoteItem({model: m});
        view.render();    
        $('.active-notes').append(view.el);
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">New note created</p>');
        $('.note-input').val('');
      }
    });
    notify();
  },
  convertDate: function(date) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    var d = date;
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var meridiem = hours > 12 ? 'PM' : 'AM';
    var hour = hours > 12 ? hours - 12 : hours;
    month = ('' + (month + 1)).slice(-2);
    var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + minutes + meridiem;
    return timestamp;
  },
});
var NoteItem = Backbone.View.extend({
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-trash' : 'clear',
    'click .fa-check' : 'done'
  },
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  clear: function() {
    var self = this;
    $.ajax({
      type: 'DELETE',
      url: 'notes/' + this.model.get('_id'),
      success: function(data) {
        self.remove();
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + data + '</p>');
        notify();
      },
      error: function(err) {
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + err + '</p>');
        notify();
      }
    });
  },
  done: function(e) {
    var $evt = $(e.currentTarget);
    var note = this.model;
    if (!this.model.get('done')) {
      $evt.parent().parent().addClass('done');
      note.set({done: true});
    } else {
      $evt.parent().parent().removeClass('done');
      note.set({done: false});
    }
    $.ajax({
      type: 'PUT',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      dataType: 'JSON',
      success: function(data) {
        console.log(data);
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">Note updated</p>');
        notify();
      },
      error: function(err) {
        console.log(err);
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">Note updated</p>');
        notify();
      }
    });
    this.render();
  },
});
var MenuItem = Backbone.View.extend({
  itemTemplate: _.template($('#list-name-item').html()),
  initalize: function() {
    this.render();
  },
  events: {
    'click .list-item' : 'select'
  },
  render: function(list) {
    $('.list-names-container').append(this.itemTemplate(list));
    return this;
  },
  select: function() {
    var listName = this.model.get('name');
    var activeList = new ActiveList({collection: notes, name: listName});
  },
});
var MenuLists = Backbone.View.extend({
  el: '.list-container',
  initialize: function() {
    this.render();
  },
  render: function() {
    var view = new MenuItem({model: listName});
    view.render();
    $('.list-names-container').append(view.el);
    var activeList = new ActiveList({collection: this.collection});
  },
});
var Wrapper = Backbone.View.extend({
  el: '.app-wrapper',
  initialize: function() {
    var self = this;
    this.collection = new Notes();
    this.collection.fetch({
      success: function(data) {
        console.log('fetch ', data);
        self.lists();
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
  },
  lists: function() {
    var self = this;
    var a = [];
    var b =[];
    this.collection.each(function(model) {
      var list = model.get('list');
      if (a.indexOf(list) === -1) {
        var length = self.collection.where({list: list}).length;
        var view = new MenuItem();
        view.render({name: list, length: length});
        a.push(list);
      }
    });
    return this;
  },
  menu: function(array) {
    var models = self.collection.where({list: listName});
    for (var i = 0; i < array.length; i++) {
      console.log(array[i].name);
      console.log(array[i].models);
    }

  }
});
new WOW().init();
var wrapper = new Wrapper();

$(document).on('click', '.list-names-container .list-item', function() {
  $('.list-item').removeClass('active');
  $(this).addClass('active');
});

var notify = function() {
  setTimeout(function(){
    $('.kurt-loader').fadeOut('fast', function() {
      $('.kurt-loader').empty();
      $('.kurt-loader').css({'display': 'block'});
    });
  }, 3000);
};