RB.e = {

  init: function() {
    RB.e.setActiveList();
    RB.e.toggleLists();
  },

  setActiveList: function() {
    $(document).on('click', '.lists-container .list-item', function() {
      var $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
    });
  },

  toggleLists: function() {
    $(document).on('click', '.toggle-list-btn', function() {
      var $listsContainer = $('.lists-container');
      var $icon = $('.toggle-list-btn .fa');

      $listsContainer.slideToggle('fast');
      $icon.toggleClass('collapsed');

    });
  },

};