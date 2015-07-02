var MenuLists = Backbone.View.extend({
  el: '.list-container',
  initalize: function() {
    this.render();
  },
  render: function() {
    var a = this.collection.lists();
    for (var i = 0; i < a.length; i++) {
      console.log(a[i]);
      var list = new ListName({name: a[i]});
      var view = new MenuItem({model: list});
      view.render();
      $('.list-names-container').append(view);
    }
  },
});