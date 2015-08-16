RB.ListItem = Backbone.View.extend({

  className: 'list-model',
  itemTemplate: _.template($('#list-name-template').html()),

  initialize() {
    this.render();
  },

  render() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));

    return this;
  }
});