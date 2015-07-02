var ActiveList = Backbone.View.extend({
  el: '.active-list-container',
  initialize: function() {
    this.render();
  },
  render: function() {
    this.collection.each(function(model) {
      var view = new NoteItem({model: model});
      view.render();
      $('.active-notes').append(view);        
    });
  }
});