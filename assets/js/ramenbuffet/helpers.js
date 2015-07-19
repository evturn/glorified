RAMENBUFFET.fn = {

  setLists: function(collection) {
    var $lists = $('.lists-container');
    var array = [];

    $lists.empty();

    collection.each(function(model) {
      var list = model.get('list');

      if (array.indexOf(list) === -1) {
        array.push(list);
      }

    });

    for (var i = 0; i < array.length; i++) {
      var listname = array[i];
      var total = collection.where({list: listname}).length;
      var view = new RAMENBUFFET.ListItem();

      view.render({
        name: listname,
        length: total
      });

      $lists.append(view.el);
    }

    return this;
  },

  setActive: function(collection, listname) {
    var $notes = $('.active-notes-container');
    var models = collection.where({list: listname});
    var active = new RAMENBUFFET.ActiveList(models);

    $notes.empty();
    for (var i = 0; i < models.length; i++) {
      var view = new RAMENBUFFET.ActiveNote({model: models[i]});

      view.render();
      $notes.append(view.el);
    }

    return this;
  },

};