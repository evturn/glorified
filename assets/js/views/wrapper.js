var Wrapper = Backbone.View.extend({
  el: '.app-wrapper',
  initialize: function() {
    var self = this;
    this.collection = new Notes();
    this.collection.fetch({
      success: function(data) {
        console.log('fetch ', data);
        self.setLists();
        self.setActive();
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
    this.listenTo(this.collection, 'all', this.setLists);
    parent.location.hash = '';
  },
  events: {
    'click .create-list-btn' : 'newList'
  },
  setLists: function() {
    $('.list-names-container').empty();
    var self = this;
    var a = [];
    this.collection.each(function(model) {
      var list = model.get('list');
      if (a.indexOf(list) === -1) {
        a.push(list);
      }
    });
    for (var i = 0; i < a.length; i++) {
      var name = a[i];
      var total = self.collection.where({list: a[i]}).length;
      var view = new MenuItem();
      view.render({name: name, length: total});
      $('.list-names-container').append(view.el);
    }
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
  newList: function() {
    $('.active-notes').empty();
    $('.list-input').val('');
    $('.list-input').focus();
    var activeList = new ActiveList();
  }
});