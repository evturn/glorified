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
    var notesArray = this.collection.where({list: listname});
    var notes = RB.getNotes(notesArray);

    RB.setNotes('.active-notes-container', notes);
  },

});