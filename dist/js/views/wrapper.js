var App = Backbone.View.extend({
  el: 'app-wrapper',
  initialize: function() {
    this.collection = new Notes();
    this.collection.fetch({
      success: function(data) {
        console.log('data ', data);
      }
    });
    this.render();
  },
  render: function() {
    
  },
});