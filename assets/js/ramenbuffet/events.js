RAMENBUFFET.e = {
  init: function() {
    this.fixPath();
  },
  notify: function(notification) {
    var $loader = $('.kurt-loader');
    var icon = '<i class="fa fa-bolt"></i>';
    var message = '<p class="notification thin-lg animated fadeIn">' + icon + ' ' + notification + '</p>';
    $loader.html(message);
    var $notification = $('.notification');
    setTimeout(function() {
      $notification.removeClass('fadeIn');
      $notification.addClass('fadeOut');
    }, 1200);

  },
  fixPath: function() {
    if (window.location.hash && window.location.hash === "#_=_") {
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = "";
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }
};