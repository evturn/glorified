RB.App = Backbone.View.extend({

  el: '.dmc',

  listnameItem: _.template($('#list-name-template').html()),

  initialize: function() {
    this.render();
  },

  events: {},

  render: function() {
    var lists = RB.getLists(this.collection);
    RB.setLists(this.collection, lists, this.listnameItem);

  },

});