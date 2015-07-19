RAMENBUFFET.App = Backbone.View.extend({

  el: '.dmc',

  initialize: function() {
    var self = this;

    RAMENBUFFET.http.get();
  },

  events: {
    'click .create-list-btn' : 'newList',
    'click .menu-list.list-item' : 'select'
  },
  select: function(e) {
    console.log(e);
    var $listName = $(e.currentTarget).data('id');
    RAMENBUFFET.fn.setActive(this.collection, $listName);
    return this;
  },

  newList: function() {
    $('.active-notes-container').empty();
    $('.list-input').val('');
    $('.list-input').focus();
    var activeList = new RAMENBUFFET.ActiveList();
  }
});