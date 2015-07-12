RAMENBUFFET.e = {
  init: function() {
    this.fixPath();
  },
  notify: function(notification) {
    $('.kurt-loader').html('<p class="notification thin-lg animated fadeIn">' + notification + '</p>');
    $('.notification').fadeOut(1000, function() {
      $('.kurt-loader').empty();
    });
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