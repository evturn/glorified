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
    'click .create-note-btn' : 'createNote',
    'keypress .note-input'   : 'createOnEnter',
    'keyup .active-input'    : 'elluminateBtn'
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
        var cA = model.get('created');
        var timestamp = self.convertDate(new Date(cA));
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
  },
  convertDate: function(date) {
    var cA = date;
    var year = cA.getUTCFullYear();
    var month = cA.getUTCMonth();
    var day = cA.getUTCDate();
    month = ('0' + (month + 1)).slice(-2);
    var timestamp = day + '/' + month;
    return timestamp;
  },
});