RB.post = function() {
  var listname = $('.list-input').val();
  var date = Date.now();
  var timestamp = RB.convertDate(date);
  var notes = RB.collection;
  var note = {
    body: $('.note-input').val(),
    list: $('.list-input').val(),
    created: date,
    timestamp: timestamp,
    done: false
  };

  if (notes.findWhere({body: note.body}) && notes.findWhere({list: note.list})) {
    return false;
  }

  notes.create(note, {

    success: function(data) {
      RB.setNote(data);
      RB.reset(listname);
    },
    error: function(err) {
      console.log(err);
    }

  });

};

RB.put = function(model) {
  var list = model.get('list');
  var notes = RB.collection;

  model.save(null, {

    success: function(data) {
      notes.set(data);
      RB.reset(list);
      RB.notify('Updated');

    }

  });
};

RB.destroy = function(model) {
  var listname = model.get('list');

  model.destroy({

    success: function(model) {
      RB.reset(listname);
      RB.notify('Note deleted');

    },
    error: function(err) {
      RB.reset(listname);
      RB.notify('Removed');

    }

  });
};