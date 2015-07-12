new WOW().init();
var wrapper = new Wrapper();

var RAMENBUFFET = {
  init: function() {
    RAMENBUFFET.lists.init();
  }
};

RAMENBUFFET.lists = {
  init: function() {
    this.setActiveList();
    this.collapseLists();
    this.expandLists();
  },
  setActiveList: function() {
    $(document).on('click', '.lists-container .list-item', function() {
      $('.list-item').removeClass('active');
      $(this).addClass('active');
    });
  },
  collapseLists: function() {
    $(document).on('click', '.toggle-list-btn.close-list', function() {
      var $lists = $('.lists-container .list-item');
      var $open = $('.toggle-list-btn.open-list');
      var $close = $('.toggle-list-btn.close-list');
      $close.addClass('hidden');
      $open.removeClass('hidden');
      $lists.slideToggle('fast');
    });
  },
  expandLists: function() {
    $(document).on('click', '.toggle-list-btn.open-list', function() {
      var $lists = $('.lists-container .list-item');
      var $open = $('.toggle-list-btn.open-list');
      var $close = $('.toggle-list-btn.close-list');
      $close.removeClass('hidden');
      $open.addClass('hidden');
      $lists.slideToggle('fast');
    });
  }
};

$(document).ready(function() {
  RAMENBUFFET.init();
});

RAMENBUFFET.e = {
  notify: function(notification) {
    $('.kurt-loader').html('<p class="notification thin-lg animated bounceIn">' + notification + '</p>');
    $('.notification').fadeOut('slow', function() {
      $('.kurt-loader').empty();
    });
  }
};




$(function() {
  $('[data-toggle="popover"]').popover({html: true});

  if (window.location.hash && window.location.hash === "#_=_") {
    var scroll = {
      top: document.body.scrollTop,
      left: document.body.scrollLeft
    };
    window.location.hash = "";

    document.body.scrollTop = scroll.top;
    document.body.scrollLeft = scroll.left;
  }

});



