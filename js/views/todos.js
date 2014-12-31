var app = app || {};

app.TodoView =  Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#item-template').html()),
	events: {
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  // Rerenders the titles of the item
  render: function() {
    this.$el.html( this.template( this.model.attributes ) );
    this.$input = this.$('.edit');
    return this;
  },
	edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
  },

});