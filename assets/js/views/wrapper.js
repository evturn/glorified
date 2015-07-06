var Wrapper = Backbone.View.extend({
  el: '.app-wrapper',
  initialize: function() {
    var self = this;
    this.collection = new Notes();
    this.collection.fetch({
      success: function(data) {
        console.log('fetch ', data);
        self.lists();
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
  },
  lists: function() {
    var self = this;
    var a = [];
    var b =[];
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
  menu: function(array) {
    var models = self.collection.where({list: listName});
    for (var i = 0; i < array.length; i++) {
      console.log(array[i].name);
      console.log(array[i].models);
    }

  }
});