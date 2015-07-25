RB.post = function() {
  var $noteInput = $('.note-input');
  var listname = $('.list-input').val();
  var date = Date.now();
  var timestamp = RB.convertDate(date);

  var note = {
    body: $noteInput.val(),
    list: listname,
    created: date,
    timestamp: timestamp,
    done: false
  };

  if (RB.collection.findWhere({body: note.body}) && RB.collection.findWhere({list: note.list})) {
    return false;
  }

  RB.collection.create(note, {

    success: function(data) {
      RB.setNote(data);
      RB.reset(listname);
      $noteInput.focus();

    },
    error: function(err) {
      console.log(err);
    }

  });

};

RB.put = function(model) {
  var listname = model.get('list');

  model.save(null, {

    success: function(data) {
      RB.collection.set(data);
      RB.reset(listname);
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