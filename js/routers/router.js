var Router = Backbone.Router.extend({
  routes:{
    '*filter': 'setFilter'
  },
  setFilter: function( param ) {
  	if (param) {
      param = param.trim();
    }
    TodoFilter = param || '';
    workload.trigger('filter');
  }
 });

router = new Router();
Backbone.history.start();