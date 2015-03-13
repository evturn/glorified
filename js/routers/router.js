var Router = Backbone.Router.extend({
  routes:{
    '*filter': 'setFilter'
  },
  setFilter: function( param ) {
  	if (param) {
      param = param.trim();
    }
    TodoFilter = param || '';
    Todos.trigger('filter');
  }
 });

TodoRouter = new Router();
Backbone.history.start();