var ListActive = Backbone.View.extend({
  el: '.active-list-container',
  itemContainer: _.template($('#list-active-item').html()),
  initialize: function() {
    this.render();
  },
  render: function() {
    $('.list-items-container').append(this.itemContainer(this.model.toJSON()));
    return this;
  },
});