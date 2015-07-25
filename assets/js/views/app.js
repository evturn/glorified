RB.App = Backbone.View.extend({

  el: '.dmc',

  events: {
    'click .lists-container .list-item' : 'renderList'
  },

  render: function() {

  },

  renderList: function(e) {
    var listname = $(e.currentTarget).data('id');
    var notes = RB.collection.where({list: listname});

    RB.setNotes('.active-notes-container', notes);
  },

});