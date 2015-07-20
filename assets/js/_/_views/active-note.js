RAMENBUFFET.ActiveNote = Backbone.View.extend({

  className: 'list-item',

  itemTemplate: _.template($('#list-active-item').html()),

  initalize: function() {
    this.render();
  },

  events: {
    'click .fa-trash'     : 'clear',
    'click .fa-check'     : 'done',
    'click .fa-sort-up'   : 'moveUp',
    'click .fa-sort-down' : 'moveDown'
  },

  render: function() {
    this.$el.html(this.itemTemplate(this.model.toJSON()));
    return this;
  },

  clear: function() {
    RAMENBUFFET.http.destroy(this.model);
  },

  done: function(e) {
    var $evt = $(e.currentTarget);
    var note = RAMENBUFFET.tn.done($evt, this.model);
    var updated = RAMENBUFFET.http.put(note);
    var listname = updated.get('list');
    RAMENBUFFET.fn.setActive(listname);
  },

  moveUp: function() {
    RAMENBUFFET.tn.up(this.model);
  },

  moveDown: function() {
    RAMENBUFFET.tn.down(this.model);
  },

});