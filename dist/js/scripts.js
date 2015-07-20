var RB = {};

RB.Note = Backbone.Model.extend({});

RB.Notes = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
});

RB.List = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
});
RB.all = function() {
  var notes = new RB.Notes();

  notes.fetch({

    success: function(collection) {
      console.log(collection);
      var app = new RB.App({collection: collection});
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

RB.setLists = function(collection, array, template) {
  var lists = array;
  var $listsContainer = $('.lists-container');

  for (var i = 0; i < lists.length; i++) {
    var listObjects = collection.where({list: lists[i]});
    var subCollection = new RB.List(listObjects);
    var inputs = new RB.Input();

    $listsContainer.append(template({
      name: lists[i],
      length: subCollection.length}));
  }

};

RB.getNotes = function(models) {
  var subCollection = new RB.List(models);

  return subCollection;

};

RB.setNotes = function(selector, collection) {
  var listname = collection.models[0].get('list');

  $('.active-input.list-input').val(listname);
  $selector = RB.tojquery(selector);
  $selector.empty();

  collection.each(function(model) {
    var view = new RB.NoteItem({model: model});

    $selector.append(view.render().el);
  });

};

RB.notify = function(notification) {
  var $loader = $('.kurt-loader');
  var $notification = $('.notification');
  var icon = '<i class="fa fa-asterisk"></i>';
  var message = '<p class="notification thin-lg animated fadeIn">' + icon + ' ' + notification + '</p>';

  $loader.html(message);
  setTimeout(function() {
    $notification.removeClass('fadeIn');
    $notification.addClass('fadeOut');
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

  listnameItem: _.template($('#list-name-template').html()),

  initialize: function() {
    this.render();
  },

  events: {
    'click .lists-container .list-item' : 'renderList'
  },

  render: function() {
    var lists = RB.getLists(this.collection);

    RB.setLists(this.collection, lists, this.listnameItem);
  },

  renderList: function(e) {
    var listname = $(e.currentTarget).data('id');
    var notesArray = this.collection.where({list: listname});
    var notes = RB.getNotes(notesArray);

    RB.setNotes('.active-notes-container', notes);
  },

});
RB.Input = Backbone.View.extend({

  el: '.active-list-container',

  inputTemplate: _.template($('#input-template').html()),

  initialize: function() {
    this.render();
  },

  render: function() {
    $('.active-list-container').html(this.inputTemplate());

    return this;
  },

});
RB.NoteItem = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#note-item-template').html()),

  initalize: function() {
    this.render();
  },

  events: {
    'click .fa-trash' : 'clear',
    'click .fa-check' : 'done',
  },

  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  },

});
RB.init();