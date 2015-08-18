// ===================
// HTTP
// ===================

_.extend(Backbone.View.prototype, {

  start() {
    app.user = new RB.User();
    app.helpers.init();

    app.user.fetch({
      success(model, response) {
        if (app.user === null) {
          app.user = model;
        }

        if (app.listsCollection === null) {
          app.listsCollection = new RB.Lists(model.attributes.lists);
          app.setLists();
          app.setProgressBars();
        }

        return app.listsCollection;
      },
      error(err) {
        console.log(err);
      }
    });
  },

  get() {
    app.user.fetch({
      success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);
        if (app.activeListId) {
          app.setNotes(app.activeListId);
        }
        app.setProgressBars();
        console.log(app.listsCollection);
      },
      error(err) {
        console.log(err);
      }
    });
  },

  post(model) {
    let self = this,
        $noteInput = $('.note-input'),
        $notesContainer = $('.active-notes-container');

    $.ajax({
      url: '/notes/',
      method: 'POST',
      data: model,
      success(model, response) {
        let note = new RB.Note(model),
            view = new RB.NoteItem({model: note});

        $notesContainer.append(view.render().el);
        $noteInput.val('').focus();
        app.validate();
        app.notify('Created');
        app.get();
      },
      error(err) {
        console.log(err);
      }
    });
  },

  put(model, attributes, view) {
    let id = model.get('_id');

    model.save(attributes, {
      url: '/notes/' + id,
      success(model, response) {
        app.notify('Updated');
        app.get();
      },
      error(error) {
        console.log('error ', error);
      }
    });
  },

  destroy(model) {
    let id = model.get('_id'),
        listId = app.getActiveListId();

    model.set('listId', listId);

    if (id !== null) {
      model.destroy({
        url: '/notes/' + id + '?listId=' + listId,
        success(model, response) {
          console.log('success ', model);
          app.notify('Removed');
          app.get();
        },
        error(err) {
          console.log('error ', err);

        },
      });

    }
  },
});