var MenuLists = Backbone.View.extend({
  el: '.list-container',
  initialize: function() {
    this.render();
  },
  render: function() {
    var self = this;
    var a = [];
    this.collection.each(function(model) {
      var list = model.get('list');
      if (a.indexOf(list) === -1) {
        a.push(list);
        var total = self.collection.where({list: list}).length;
        var listName = new ListName({name: list, length: total});
        var view = new MenuItem({model: listName});
        view.render();
        $('.list-names-container').append(view.el);
      }
    });
    var activeList = new ActiveList({collection: this.collection});
  },
});