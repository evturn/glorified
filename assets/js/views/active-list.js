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