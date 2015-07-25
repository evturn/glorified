RB.e = {
  init: function() {
    RB.e.setActiveList();
    RB.e.collapseLists();
    RB.e.expandLists();
  },
  setActiveList: function() {
    $(document).on('click', '.lists-container .list-item', function() {
      $('.list-item').removeClass('active');
      $(this).addClass('active');
    });
  },
  collapseLists: function() {
    $(document).on('click', '.toggle-list-btn', function() {
      var $listsContainer = $('.lists-container');
      var $icon = $('.toggle-list-btn .fa');

      $listsContainer.slideToggle('fast');
      $icon.toggleClass('collapsed');

    });
  },
};