var MenuItem = Backbone.View.extend({
  className: '.list-item',
  itemTemplate: _.template($('#list-name-item').html()),
  initalize: function() {
    this.render();
  },
  render: function() {
    $('.list-names-container').append(this.itemTemplate(this.model.toJSON()));
    return this;
  },
});