RAMENBUFFET.http = {

  get: function(listname) {

    notes.fetch({

      success: function(data) {
        var listname = listname || "New List";

        RAMENBUFFET.fn.setLists(data);
        RAMENBUFFET.fn.setActive(listname);

        return data;
      },

      error: function(err) {
        return RAMENBUFFET.e.notify(err);
      }

    });

  },

  post: function(model) {
    var listname = model.list;
    var created    = Date.now();
    var timestamp  = RAMENBUFFET.fn.convertDate(created);
    var note = notes.create({
        body      : model.body,
        list      : listname,
        created   : created,
        timestamp : timestamp
    });
    var view = new RAMENBUFFET.ActiveNote({model: note});
    view.render();
    $('.active-notes-container').append(view.el);
    RAMENBUFFET.fn.setLists(notes);
    RAMENBUFFET.e.notify('Note added');

  },

  put: function(model) {
    var note = notes.set(model);

    RAMENBUFFET.e.notify('Note updated');

    return note;
  },

  destroy: function(model) {
    model.destroy({
      success: function(model, response) {
        notes.remove(model);
        RAMENBUFFET.e.notify('Note deleted');
        console.log(response);
      },
      error: function(err) {
        RAMENBUFFET.e.notify(err);
        console.log(err);
      }
    });
  },
};