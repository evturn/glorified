var ActiveList = Backbone.View.extend({
  el: '.active-list-container',
  list: null,
  initialize: function(list) {
    if (!list) {
      this.render();
    } else {
      this.switchList(list.name);
    }
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
    this.collection.each(function(model) {
      if (model.get('list') === list) {
        var view = new NoteItem({model: model});
        view.render();
        $('.active-notes').append(view.el);
      }
    });
  },
});