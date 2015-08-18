// ===================
// HTTP
// ===================

_.extend(Backbone.View.prototype, {

  start() {
    let user = new RB.User();
    this.helpers.init();

    user.fetch({

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

  post(model) {
    let self = this,
        $noteInput = $('.note-input'),
        $notesContainer = $('.active-notes-container');

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
        app.updateListTotal();
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
          self.updateListTotal();
        },
        error(err) {
          console.log('error ', err);

        },
      });

    }
  },
});