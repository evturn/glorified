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
    this.listenTo(this.collection, 'change', this.Lists);
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
    this.setActive();
    return this;
  },
  setActive: function(listName) {
    $('.active-notes').empty();
    var active = this.collection.where({list: listName});
    var activeList = new ActiveList(active);
    for (var i = 0; i < active.length; i++) {  
      var view = new NoteItem({model: active[i]});
      view.render();
      $('.active-notes').append(view.el);
    }
    return this;
  },
});