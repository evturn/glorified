var MenuItem = Backbone.View.extend({
  itemTemplate: _.template($('#list-name-item').html()),
  initalize: function() {
    this.render();
  },
  events: {
    'click .list-item' : 'select'
  },
  render: function(list) {
    $('.list-names-container').append(this.itemTemplate(list));
    return this;
  },
  select: function() {
    var listName = this.model.get('name');
    var activeList = new ActiveList({collection: notes, name: listName});
  },
});