var ListName = Backbone.Model.extend({});
var Note = Backbone.Model.extend({});
var User = Backbone.Model.extend({});
var Notes = Backbone.Collection.extend({
  url: '/notes',
  model: Note,
  initialize: function() {
    var self = this;
    this.fetch({
      success: function(data) {
        console.log('fetch ', data);
        var menuLists = new MenuLists({collection: data});
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
  },
  lists: function(serverData) {
    var data = serverData || this;
    var a = [];
    for (var i = 0; i < data.models.length; i++) {
      var list = data.models[i].attributes.list;
      if (a.indexOf(list) === -1) {
        a.push(list);
      }
    }
    return a;
  },
  firstList: function() {
    var lists = this.lists();
    console.log(lists[0]);
  },
  newestList: function() {
    var lists = this.lists();
    console.log(lists[length - 1]);
  }
});

var notes = new Notes();
var ActiveList = Backbone.View.extend({
  el: '.active-list-container',
  inputTemplate: _.template($('#active-input').html()),
  list: null,
  initialize: function(list) {
    if (!list) {
      this.render();
    } else {
      this.switchList(list.name);
    }
  },
  events: {
    'click .create-note-btn': 'createNote'
  },
  render: function() {
    var self = this;
    this.collection.each(function(model) {
      var view = new NoteItem({model: model});
      view.render();
      $('.active-notes').append(view.el);
    });
  },
  switchList: function(list) {
    $('.active-notes').empty();
    var self = this;
    var listName = {name: list};
    $('.active-list').html(this.inputTemplate(listName));
    this.collection.each(function(model) {
      if (model.get('list') === list) {
        var view = new NoteItem({model: model});
        view.render();
        $('.active-notes').append(view.el);
      }
    });
  },
  createNote: function() {
    $('.kurt-loader').html('<img src="img/dog.gif">');
    var body = $('.note-input').val();
    var list = $('.list-input').val();
    if (body === '' || list === '') {
      return false;
    }
    var note = notes.create({
      body: body,
      list: list
    });
    var view = new NoteItem({model: note});
    view.render();    
    $('.active-notes').append(view.el);
    $('.kurt-loader').fadeOut('fast', function() {
      $('.kurt-loader').empty();
    });
    $('.note-input').val('');
  }
});
var NoteItem = Backbone.View.extend({
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
});
var MenuItem = Backbone.View.extend({
  itemTemplate: _.template($('#list-name-item').html()),
  initalize: function() {
    this.render();
  },
  events: {
    'click .list-text' : 'select'
  },
  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));
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
    var a = [];
    this.collection.each(function(model) {
      var list = model.get('list');
      if (a.indexOf(list) === -1) {
        a.push(list);
        var listName = new ListName({name: list});
        var view = new MenuItem({model: listName});
        view.render();
        $('.list-names-container').append(view.el);
      }
    });
    var activeList = new ActiveList({collection: this.collection});
  },
});
function colorGenerator() {
  var colors = ['red', 'blue', 'green', 'yellow', 'purple', 'grey', 'black', 'orange', 'brown'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

$('.landing-header').on('click', function() {
  $('.landing-header a').css('color', colorGenerator());
});