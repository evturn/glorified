// ===================
// HTTP
// ===================

_.extend(Backbone.View.prototype, {

  start() {
    app.renderForms();
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
    app.helpers.init();
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

  get(options={render:true, _id:false}) {
    app.user.fetch({
      success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);

        if (options._id) {
          app.activeListId = options._id;
          app.setActiveListId(app.activeListId);
          app.setLists();
        }
        else if (options.render === false) {
          app.setLists();
          app.setProgressBars();

          return false;
        }
        app.setNotes(app.activeListId);
        app.setProgressBars();
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
        app.get({_id: model._id, render: true});
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

  list: {

    destroy(model, id) {
      if (id !== null) {
        model.destroy({
          url: '/lists/' + id,
          success(model, response) {
            console.log('success ', model);
            app.removeListItemById(id);
            app.notify('Removed');
            app.get({render: false});
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