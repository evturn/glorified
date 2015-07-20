RB.Input = Backbone.View.extend({

  el: '.active-list-container',

  inputTemplate: _.template($('#input-template').html()),

  initialize: function() {
    this.render();
  },

  render: function() {
    $('.active-list-container').html(this.inputTemplate());

    return this;
  },

});