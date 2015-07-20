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