RB.App = Backbone.View.extend({

  el: '.dmc',

  initialize: function() {
    this.render();
  },

  events: {
    'click .lists-container .list-item' : 'renderList'
  },

  render: function() {
    var lists = RB.getLists(this.collection);

    RB.setLists(this.collection, lists);
  },

  renderList: function(e) {
    var listname = $(e.currentTarget).data('id');
    var notes = this.collection.where({list: listname});

    RB.setNotes('.active-notes-container', notes);
  },

});