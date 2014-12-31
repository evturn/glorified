var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#todoapp',
	statsTemplate: _.template($('#stats-template').html()),
	initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');
    this.listenTo(app.Todos, 'add', this.addOne);
    this.listenTo(app.Todos, 'reset', this.addAll);
  },


});