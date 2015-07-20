RAMENBUFFET.tn = {

  done: function($event, model) {
    var $selector = $event.parent().parent();
    var note = model;


    if (!note.get('done')) {
      note.set({done: true});
      $selector.addClass('done');
    }
    else {
      note.set({done: false});
      $selector.removeClass('done');

    }

    return note;
  },

  up: function(model) {
    var note = model;
    var positionA = note.get('position');
    var listname = note.get('list');
    var list = notes.where({list: listname});
    var total = list.length;

    if (positionA !== 1) {
      var ajacent;
      var positionB;

      for (var i = 0; i < total; i++) {
          var ajacent = list[i]; // jshint ignore:line
          var positionB = ajacent.get('position'); // jshint ignore:line

        if (positionB === (positionA - 1)) {
          note.set({position: positionB});
          ajacent.set({position: positionA});


        }

      }

    RAMENBUFFET.http.put(note);
    RAMENBUFFET.http.put(ajacent);
    }


    else {

      return false;
    }

  },

  down: function(model) {
    var note = model;
    var position = note.get('position');
    var list = note.get('list');
    var models = notes.where({list: list});
    var total = models.length;
    if (position !== total) {
      for (var i = 0; i < total; i++) {
        if (models[i].get('position') === (position + 1)) {
          var neighbor = models[i];
          neighbor.set({position: position});
          RAMENBUFFET.http.put(self, neighbor);
        }
      }
      note.set({position: position + 1});
      RAMENBUFFET.http.put(self, note);
    } else {
      return false;
    }
  },
};