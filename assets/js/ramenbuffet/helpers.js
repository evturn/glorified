RAMENBUFFET.fn = {

  selectList: function(listname) {
    RAMENBUFFET.fn.setActive(listname);

    return this;
  },

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

  setActive: function(listname) {
    var $notes = $('.active-notes-container');
    var models = notes.where({list: listname});
    var active = new RAMENBUFFET.ActiveList(models);

    var listModels = new RAMENBUFFET.Notes(models);
    for (var i = 0; i < listModels.length; i++) {
      var listedNote = listModels.models[i].set({position: i + 1});

    }

    $notes.empty();
    for (var i = 0; i < listModels.length; i++) {
      var view = new RAMENBUFFET.ActiveNote({model: listModels.models[i]});

      view.render();
      $notes.append(view.el);
    }

    return this;
  },

  convertDate: function(date) {
    var d = new Date(date);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var min = minutes > 10 ? minutes : ('0' + minutes);
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    var hour = hours > 12 ? hours - 12 : hours;
    month = ('' + (month + 1)).slice(-2);
    var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;
    return timestamp;
  },

};