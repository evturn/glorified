RAMENBUFFET.App = Backbone.View.extend({

  el: '.dmc',

  initialize: function() {
    var self = this;

    RAMENBUFFET.http.get();
  },

  events: {
    'click .create-list-btn'     : 'newList',
    'click .menu-list.list-item' : 'select'
  },

  select: function(e) {
    var $listname = $(e.currentTarget).data('id');

    RAMENBUFFET.fn.selectList($listname);

    return this;
  },

  newList: function() {
    $('.active-notes-container').empty();
    $('.list-input').val('');
    $('.list-input').focus();
    var activeList = new RAMENBUFFET.ActiveList();
  }
});