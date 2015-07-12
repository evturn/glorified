RAMENBUFFET.ActiveNote = Backbone.View.extend({
  className: 'list-item wow fadeIn animated',
	itemTemplate: _.template($('#list-active-item').html()),
	initalize: function() {
		this.render();
	},
  events: {
    'click .fa-trash'     : 'clear',
    'click .fa-check'     : 'put',
    'click .fa-sort-up'   : 'moveUp',
    'click .fa-sort-down' : 'moveDown'
  },
	render: function() {
		this.$el.html(this.itemTemplate(this.model.toJSON()));
		return this;
	},
  clear: function() {
    var self = this;
    var note = this.model;
    RAMENBUFFET.http.destroy(self, note);
  },
  put: function(e) {
    var $evt = $(e.currentTarget);
    var self = this;
    var note = this.model;
    if (!note.get('done')) {
      $evt.parent().parent().addClass('done');
      note.set({done: true});
    } else {
      $evt.parent().parent().removeClass('done');
      note.set({done: false});
    }
    RAMENBUFFET.http.put(self, note);
    this.render();
  },
  moveUp: function() {
    var self = this;
    var note = this.model;
    var position = note.get('position');
    var list = note.get('list');
    var models = wrapper.collection.where({list: list});
    var total = models.length;
    if (position !== 1 || 0) {
      for (var i = 0; i < total; i++) {
        if (models[i].get('position') === (position - 1)) {
          var neighbor = models[i];
          neighbor.set({position: position});
          RAMENBUFFET.http.put(self, neighbor);
        }
      }
      note.set({position: position - 1});
      RAMENBUFFET.http.put(self, note);
    } else {
      return false;
    }
  },
  moveDown: function() {
    var self = this;
    var note = this.model;
    var position = note.get('position');
    var list = note.get('list');
    var models = wrapper.collection.where({list: list});
    var total = models.length;
    if (position !== total) {
      for (var i = 0; i < total; i++) {
        if (models[i].get('position') === (position + 1)) {
          var neighbor = models[i];
          neighbor.set({position: position});
          RAMENBUFFET.http.put(self, neighbor);
        }
      }
      note.set({position: position + 1});
      RAMENBUFFET.http.put(self, note);
    } else {
      return false;
    }
  },
});