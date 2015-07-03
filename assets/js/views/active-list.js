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
    $('.active-list.section-header').html(this.inputTemplate(listName));
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