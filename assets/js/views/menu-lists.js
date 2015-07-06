var MenuLists = Backbone.View.extend({
  el: '.list-container',
  initialize: function() {
    this.render();
  },
  render: function() {
    var view = new MenuItem({model: listName});
    view.render();
    $('.list-names-container').append(view.el);
    var activeList = new ActiveList({collection: this.collection});
  },
});