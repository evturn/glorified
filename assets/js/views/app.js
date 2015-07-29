RB.App = Backbone.View.extend({

  el: '.dmc',

  initialize: function() {
    RB.e.fixPath();
    this.get();
    RB.e.init();
  },

  events: {
    'click .lists-container .list-item' : 'renderList',
    'click .create-list-btn' : 'createList'
  },

  renderList: function(e) {
    var listname = $(e.currentTarget).data('id');
    var notes = this.collection.where({list: listname});

    this.setNotes('.active-notes-container', notes);
    RB.e.deviceEnv(400);

  },

  createList: function() {
    var $noteInput = $('.note-input');
    var $listInput = $('.list-input');
    var $notesContainer = $('.active-notes-container');

    $noteInput.val('');
    $listInput.val('').focus();
    $notesContainer.empty();
  },



});