// ===================
// HTTP
// ===================

_.extend(Backbone.View.prototype, {

    start() {
    let user = new RB.User();

    user.fetch({

      success(model, response) {
        if (app.user === null) {
          app.user = model;
        }

        if (app.listsCollection === null) {
          app.listsCollection = new RB.Lists(model.attributes.lists);
          let lists = app.getListNames(app.listsCollection);
          app.setLists(lists);
        }

        console.log(app.listsCollection);

        return app.listsCollection;

      },
      error(err) {
        console.log(err);
      }

    });
  },

  post(model) {
    var $noteInput = $('.note-input');
    var $notesContainer = $('.active-notes-container');

    $.ajax({
      url: '/notes/',
      method: 'POST',
      data: model,
      success: function(model, response) {
        console.log(model);
        $noteInput.val('').focus();
        app.validate();
        let note = new RB.Note(model);
        let view = new RB.NoteItem({model: note});
        $notesContainer.append(view.render().el);
        _RB.notify('Created');

      },
      error: function(err) {
        console.log(err);
      }
    });

  },

  put: function(model, attributes, view) {
    var self = this;
    var id = model.get('_id');
    var listname = model.get('list');

    model.save(attributes, {

      url: '/notes/' + id,
      success: function(model, response) {
        self.notify('Updated');
        self.onChangeListeners();
        view.render();
      },
      error: function(error) {
        console.log(error);
      }
    });
  },

  destroy: function(model) {
    var self = this;
    var listname = model.get('list');
    var id = model.get('_id');

    if (id !== null) {

      model.destroy({
        wait: true,
        url: '/notes/' + id,
        dataType: 'text',
        data: {_id: id},
        success: function(model) {
          console.log('success ', model);
          self.notify('Removed');
          self.onChangeListeners();
        },
        error: function(err) {
          console.log('error ', err);

        },
      });

    }
  },
});