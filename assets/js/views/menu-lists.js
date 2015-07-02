var MenuLists = Backbone.View.extend({
  el: '.list-container',
  initialize: function() {
    this.render();
  },
  render: function() {
    var a = [];
    this.collection.each(function(model) {
      var list = model.get('list');
      if (a.indexOf(list) === -1) {
        var listName = new ListName({name: list});
        var view = new MenuItem({model: listName});
        view.render();
        $('.list-names-container').append(view);
      }
    });
    
  },
});