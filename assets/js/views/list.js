RB.ListItem = Backbone.View.extend({

  className: 'list-item',
  itemTemplate: _.template($('#list-name-template').html()),
  attributes: {},
  initialize() {
    this.render();
  },

  render() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));
    this.attributes['data-name'] = this.model.get('name');
    this.attributes['data-id'] = this.model.get('_id');

    return this;
  }
});