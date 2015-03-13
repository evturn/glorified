TaskView =  Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#item-template').html()),
	events: {
		'click .toggle': 'togglecompleted',
    'dblclick label': 'edit',
    'click .destroy': 'clear',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  // If an indivdual item gets updated it will rerender the view
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // Rerenders the titles of the item
  render: function() {
    this.$el.html( this.template( this.model.attributes ) );
    this.$el.toggleClass( 'completed', this.model.get('completed') );
    this.toggleVisible();
    this.$input = this.$('.edit');
    return this;
  },
  toggleVisible : function () {
    this.$el.toggleClass( 'hidden',  this.isHidden());
  },
  isHidden : function () {
    var isCompleted = this.model.get('completed');
    return ( // hidden cases only
      (!isCompleted && TodoFilter === 'completed')
      || (isCompleted && TodoFilter === 'active')
    );
  },
  togglecompleted: function() {
    this.model.toggle();
  },
	edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },
  // Close editing mode and save changes to the item
	close: function() {
    var value = this.$input.val().trim();
    if ( value ) {
      this.model.save({ title: value });
    } else {
    	this.clear();
    }

    this.$el.removeClass('editing');
  },
  updateOnEnter: function( e ) {
	  if ( e.which === ENTER_KEY ) {
	    this.close();
	  }
	},
	clear: function() {
    this.model.destroy();
  }
});