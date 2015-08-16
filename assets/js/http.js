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
        view.notify('Created');

      },
      error: function(err) {
        console.log(err);
      }
    });

  },

  put: function(model, attributes, view) {
    let self = this,
        id = model.get('_id');

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
    let self = this,
      id = model.get('_id'),
      listId = self.getActiveListId();

    model.set('listId', listId);

    console.log(model.attributes);
    if (id !== null) {

      model.destroy({
        url: '/notes/' + id + '?listId=' + listId,
        success: function(model, response) {
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