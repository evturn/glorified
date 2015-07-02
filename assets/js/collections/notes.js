var Notes = Backbone.Collection.extend({
  url: '/notes',
  model: Note,
  initialize: function() {
    var self = this;
    this.fetch({
      success: function(data) {
        console.log('fetch ', data);
        return data;
      },
      error: function(err) {
        $('.active-notes').prepend('<p class="lead">' + err + '</p>');
      }
    });
  },
  lists: function(serverData) {
    var data = serverData || this;
    var a = [];
    for (var i = 0; i < data.models.length; i++) {
      var list = data.models[i].attributes.list;
      if (a.indexOf(list) === -1) {
        a.push(list);
      }
    }
    return a;
  },
  firstList: function() {
    var lists = this.lists();
    console.log(lists[0]);
  },
});

var notes = new Notes();