var Note = Backbone.Model.extend({
  idAttribute: '_id'
});
var User = Backbone.Model.extend({});
var Notes = Backbone.Collection.extend({
  url: '/notes',
  model: Note
});
var ActiveList = Backbone.View.extend({
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
    'keyup .active-input'    : 'elluminateBtn'
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
    var created = Date.now();
    var timestamp = this.convertDate(created);

    if (wrapper.collection.findWhere({body: body})) {
      // Makes sure of no duplicates
      return false;
    }
    wrapper.collection.create({
        body: body,
        list: list,
        created: created,
        timestamp: timestamp
      },
      {
        success: function(data) {
          var view = new NoteItem({model: data});
          view.render();
          $('.active-notes-container').append(view.el);
          $('.kurt-loader').html('<p class="thin-lg wow bounceIn">New note created</p>');
          $('.note-input').val('');
      },
        error: function(err) {
          console.log(err);
      }
    });
    notify();
  },
  convertDate: function(date) {
    var d = new Date(date);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
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
  className: 'list-item wow fadeIn animated',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-trash' : 'clear',
    'click .fa-check' : 'put'
  },
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  clear: function() {
    var self = this;
    var note = this.model;
    $.ajax({
      type: 'DELETE',
      url: 'notes/' + this.model.get('_id'),
      data: note.toJSON(),
      success: function(data) {
        wrapper.collection.remove(note.get('_id'));
        self.remove();
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + data + '</p>');
        notify();
      },
      error: function(err) {
        self.remove();
        $('.kurt-loader').html('<p class="thin-lg wow bounceIn">' + err + '</p>');
        notify();
      }
    });
  },
  put: function(e) {
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
  className: 'menu-list list-item animated',
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
var Wrapper = Backbone.View.extend({
  el: '.dmc',
  initialize: function() {
    var self = this;
    this.collection = new Notes();
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
      var view = new MenuItem();
      view.render({name: name, length: total});
      $('.lists-container').append(view.el);
    }
    return this;
  },
  setActive: function(listName) {
    $('.active-notes-container').empty();
    var active = this.collection.where({list: listName});
    var activeList = new ActiveList(active);
    for (var i = 0; i < active.length; i++) {
      var view = new NoteItem({model: active[i]});
      view.render();
      $('.active-notes-container').append(view.el);
    }
    return this;
  },
  newList: function() {
    $('.active-notes-container').empty();
    $('.list-input').val('');
    $('.list-input').focus();
    var activeList = new ActiveList();
  }
});
new WOW().init();
var wrapper = new Wrapper();

$(document).on('click', '.lists-container .list-item', function() {
  $('.list-item').removeClass('active');
  $(this).addClass('active');
});

$(document).on('click', '.toggle-list-btn.close-list', function() {
  var $lists = $('.lists-container .list-item');
  var $open = $('.toggle-list-btn.open-list');
  var $close = $('.toggle-list-btn.close-list');
  $close.addClass('hidden');
  $open.removeClass('hidden');
  $lists.slideToggle('fast');
});

$(document).on('click', '.toggle-list-btn.open-list', function() {
  var $lists = $('.lists-container .list-item');
  var $open = $('.toggle-list-btn.open-list');
  var $close = $('.toggle-list-btn.close-list');
  $close.removeClass('hidden');
  $open.addClass('hidden');
  $lists.slideToggle('fast');
});





var notify = function() {
  setTimeout(function(){
    $('.kurt-loader').fadeOut('fast', function() {
      $('.kurt-loader').empty();
      $('.kurt-loader').css({'display': 'block'});
    });
  }, 3000);
};

$(function() {
  $('[data-toggle="popover"]').popover({html: true});

  if (window.location.hash && window.location.hash === "#_=_") {


      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = "";

      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;

  }

});



