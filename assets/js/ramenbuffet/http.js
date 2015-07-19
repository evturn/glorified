RAMENBUFFET.http = {

  get: function(callback) {

    notes.fetch({

      success: function(data) {
        var listname = "New List";

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
    var total = notes.where({list: listname}).length;
    var note = notes.create({
        body      : model.body,
        list      : listname,
        created   : created,
        timestamp : timestamp,
        position  : total + 1
    });
    var view = new RAMENBUFFET.ActiveNote({model: note});
    view.render();
    $('.active-notes-container').append(view.el);
    RAMENBUFFET.fn.setLists(notes);
    RAMENBUFFET.e.notify('Note added');

  },

  put: function(model) {
    var note = model;
    var listname = model.get('list');

    console.log(note);
    $.ajax({
      type: 'PUT',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      dataType: 'JSON',
      success: function(data) {
        RAMENBUFFET.e.notify('Note updated');
        console.log('Ajaxing ', data);
        RAMENBUFFET.fn.setActive(listname);
      },
      error: function(err) {
        RAMENBUFFET.e.notify(err);
      }
    });
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