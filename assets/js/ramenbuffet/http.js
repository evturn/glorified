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
  var id = model.get('_id');

  model.save(null, {
    url: '/notes/' + id,
    success: function(data) {

      console.log(data.attributes.done);
      RB.collection.set(data);
      RB.notify('Updated');

    }

  });
};

RB.destroy = function(model) {
  var listname = model.get('list');
  var id = model.get('_id');

  if (id !== null) {

    model.destroy({
      wait: true,
      url: '/notes/' + id,
      dataType: 'text',
      data: {_id: id},
      success: function(model) {

        RB.notify('Note deleted');
        console.log('success ', model);

      },
      error: function(err) {
        RB.notify('Removed');
        console.log('error ', err);

      },
    });

  }
};