RB.post = function() {
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

  var saved = notes.create(note);
  RB.resetActiveList(note.list);
  return saved;

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
  var list = model.get('list');

  model.destroy({
    success: function(model) {
      RB.reset(list);
      RB.notify('Note deleted');
    },
    error: function(err) {
      RB.reset(list);
      RB.notify('Removed');
    }
  });
};