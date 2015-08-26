// ===================
// HTTP
// ===================

_.extend(Backbone.View.prototype, {

  start() {
    app.renderForms();
    app.appendIcons();
    app.user                 = new RB.User();
    app.listsCollection      = null;
    app.notesCollection      = null;
    app.activeListId         = null;
    app.activeListLength     = null;
    app.mobileClient         = null;
    app.tabletClient         = null;
    app.desktopClient        = null;
    app.windowWidth          = $(window).width();
    app.$lists               = $('.lists');
    app.$notes               = $('.notes');
    app.$listInput           = $('.list-input');
    app.$noteInput           = $('.note-input');
    app.$notesContainer      = $('.notes-container');
    app.$listsContainer      = $('.lists-container');
    app.listeners.init();

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

  get(options = {listDestroyed: false, _id: false}) {
    // listDestroyed : true  DELETE REQUEST (LIST)
    // _id           : true  POST REQUEST   (ALL)

    app.user.fetch({
      success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);

        if (options.listDestroyed) {
          // LIST DESTROYED, no notes to render
          app.setLists();
          app.setProgressBars();
        }
        else if (options._id) {
          // NOTE CREATED, render all and render notes
          app.activeListId = options._id;
          app.setActiveListId(options._id);
          app.setLists();
          app.setNotes(options._id);
          app.setProgressBars();
        }
        else {
          // NOTE UPDATED
          app.setNotes(app.activeListId);
          app.resetActiveList(app.activeListId);
          app.setProgressBars();
        }
      },
      error(err) {
        console.log(err);
      }
    });
  },

  post(model) {
    $.ajax({
      url: '/notes/',
      method: 'POST',
      data: model,
      success(model, response) {
        app.$noteInput.val('').focus();
        app.validate();
        app.notify(response);
        app.get({_id: model._id});
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
    let id = model.get('_id');

    model.set('listId', app.activeListId);

    if (id !== null) {
      model.destroy({
        // Change route to '/lists/:id/notes/:id'
        url: '/notes/' + id + '?listId=' + app.activeListId,
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

  list: {

    put(model, attributes) {
      let id = model.get('_id');

      model.save(attributes, {
        url: '/lists/' + id,
        success(model, response) {
          app.notify('Updated');
          app.get();
        },
        error(error) {
          console.log('error ', error);
        }
      });
    },

    destroy(model, id) {
      if (id !== null) {
        model.destroy({
          url: '/lists/' + id,
          success(model, response) {
            console.log('success ', model);
            app.removeListItemById(id);
            app.notify('Removed');
            app.get({listDestroyed: true});
            app.createList();
          },
          error(err) {
            console.log('error ', err);
          },
        });
      }
    }
  }
});