var Wrapper = Backbone.View.extend({
  el: '.app-wrapper',
  initialize: function() {
    var self = this;
    this.collection = new Notes();
    this.collection.fetch({
      success: function(data) {
        console.log('fetch ', data);
        self.setLists();
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
  },
  setLists: function() {
    var self = this;
    var a = [];
    this.collection.each(function(model) {
      var list = model.get('list');
      if (a.indexOf(list) === -1) {
        var length = self.collection.where({list: list}).length;
        var view = new MenuItem();
        view.render({name: list, length: length});
        $('.list-names-container').append(view.el);
        a.push(list);
      }
    });
    return this;
  },
  setActive: function(listName) {
    var active = this.collection.where({list: listName});
    var activeList = new ActiveList(active);
    return this;
  },
});