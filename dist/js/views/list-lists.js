var ListLists = Backbone.View.extend({
  el: '.lists-container',
  itemContainer: _.template($('#list-name-item').html()),
  initialize: function() {
    this.render();
  },
  render: function() {
    $('.list-names-container').append(this.itemContainer(this.model.toJSON()));
    return this;
  }
});