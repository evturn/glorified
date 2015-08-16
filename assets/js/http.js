// ===================
// HTTP
// ===================

_.extend(Backbone.View.prototype, {

  start() {
    this.helpers.init(this);

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
      success(model, response) {
        console.log(model);
        $noteInput.val('').focus();
        app.validate();
        let note = new RB.Note(model);
        let view = new RB.NoteItem({model: note});
        $notesContainer.append(view.render().el);
        view.notify('Created');

      },
      error(err) {
        console.log(err);
      }
    });

  },

  put(model, attributes, view) {
    let self = this,
        id = model.get('_id');

    model.save(attributes, {

      url: '/notes/' + id,
      success(model, response) {
        self.notify('Updated');
        self.onChangeListeners();
        view.render();
      },
      error(error) {
        console.log('error ', error);
      }
    });
  },

  destroy(model) {
    let self = this,
      id = model.get('_id'),
      listId = self.getActiveListId();

    model.set('listId', listId);

    if (id !== null) {

      model.destroy({
        url: '/notes/' + id + '?listId=' + listId,
        success(model, response) {
          console.log('success ', model);
          self.notify('Removed');
        },
        error(err) {
          console.log('error ', err);

        },
      });

    }
  },
});