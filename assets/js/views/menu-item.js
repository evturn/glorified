var MenuItem = Backbone.View.extend({
  className: 'menu-list list-item animated',
  itemTemplate: _.template($('#list-name-item').html()),
  initalize: function() {
    this.render();
  },
  render: function(list) {
    this.$el.html(this.itemTemplate(list));
    this.$el.attr('data-id', list.name);
    return this;
  },
});