_.extend(Backbone.View.prototype, {

  get: function() {
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
  },


  getLists: function() {
    var arr = [];

    RB.collection.each(function(model) {
      var listname = model.get('list');

      if (arr.indexOf(listname) === -1) {
        arr.push(listname);
      }

    });

    return arr;
  },

  setLists: function(array) {
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

  },

  setNote: function(model) {
    var $notesContainer = $('.active-notes-container');
    var view = new RB.NoteItem({model: model});

    $notesContainer.append(view.render().el);
  },

  setNotes: function(selector, models) {
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

  },

  setListValue: function(listname) {
    var $listInput = $('.active-input.list-input');
    var inputs = new RB.Input();

    $listInput.val(listname);
  },

  resetActiveList: function(listname) {
    var $element = $('div').find("[data-id='" + listname + "']");

    $element.addClass('active');
  },

  notify: function(notification) {
    var $loader = $('.kurt-loader');

  },

  tojquery: function(element) {

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
  }


});