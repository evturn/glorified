RB.e = {

  init: function() {
    RB.e.setActiveList();
    RB.e.deviceEnv();

    $(document).on('click', '.toggle-list-btn', function() {
      RB.e.toggleLists();
     });
  },

  deviceEnv: function() {

    if (RB.e.isMobile()) {
      setTimeout(RB.e.toggleLists, 800);
    }

  },

  setActiveList: function() {
    $(document).on('click', '.lists-container .list-item', function() {
      var $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
    });
  },

  toggleLists: function() {
    var $listsContainer = $('.lists-container');
    var $icon = $('.toggle-list-btn .fa');

    $listsContainer.slideToggle('fast');
    $icon.toggleClass('collapsed');
  },

  isMobile: function() {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return device;

  }

};