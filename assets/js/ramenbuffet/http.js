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
  console.log(saved);
  return saved;

};

RB.put = function() {

};

RB.destroy = function(model) {
  model.destroy();
  RB.notify('Note deleted');
};