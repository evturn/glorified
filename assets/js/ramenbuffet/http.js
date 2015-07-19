RAMENBUFFET.http = {

  get: function(callback) {

    notes.fetch({

      success: function(data) {
        RAMENBUFFET.fn.setLists(data);
        RAMENBUFFET.fn.setActive(data);

        return data;
      },

      error: function(err) {
        return RAMENBUFFET.e.notify(err);
      }

    });

  },

  post: function(cxt, model) {
    var self = cxt;
    var note = model;
    wrapper.collection.create(note, {
      success: function(data) {
        var view = new RAMENBUFFET.ActiveNote({model: data});
        view.render();
        $('.active-notes-container').append(view.el);
        var message = "Note added";
        RAMENBUFFET.e.notify(message);
        $('.note-input').val('');
      },
      error: function(err) {
        var message = "Error creating note";
        RAMENBUFFET.e.notify(message);
      }
    });
  },
  put: function(cxt, model) {
    var self = cxt;
    var note = model;
    var list = note.get('list');
    $.ajax({
      type: 'PUT',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      dataType: 'JSON',
      success: function(data) {
        var message = "Note updated";
        RAMENBUFFET.e.notify(message);
        console.log('Ajaxing ', data);
        wrapper.collection.fetch({
          success: function(data) {
            console.log('Fetching ', data);
            wrapper.setActive(list);
          }
        });
      },
      error: function(err) {
        var message = "Error updating note";
        RAMENBUFFET.e.notify(message);
        console.log(err);
      }
    });
  },
  destroy: function(cxt, model) {
    var self = cxt;
    var note = model;
    $.ajax({
      type: 'DELETE',
      url: 'notes/' + note.get('_id'),
      data: note.toJSON(),
      success: function(data) {
        wrapper.collection.remove(note.get('_id'));
        self.remove();
        var message = "Note deleted";
        RAMENBUFFET.e.notify(message);
      },
      error: function(err) {
        self.remove();
        var message = "Error deleting note";
        RAMENBUFFET.e.notify(message);
      }
    });
  },
};