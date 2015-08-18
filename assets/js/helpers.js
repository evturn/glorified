// ===================
// Helpers
// ===================

_.extend(Backbone.View.prototype, {

  helpers: {
    init() {
      app.fixPath();
      app.onClickSetActive();
      app.isMobile(800);
    }
  },

  notify(notification) {
    let $loader = $('.kurt-loader');

    $loader.html('<p class="thin-sm animated fadeIn">' + notification + '</p>');

    let $paragraphTag = $loader.find('.thin-sm');

    setTimeout(function() {
      $paragraphTag.removeClass('animated fadeIn');
      $paragraphTag.addClass('animated fadeOut');
    }, 1000);
  },

  tojquery(element) {
    switch (typeof element) {
      case "object":
        if (element instanceof jQuery) {
          return element;
        }
        break;
      case "string":
        if (element.charAt(0) === '.') {
          return $(element);
        }
        else {
          return $(document.getElementsByClassName(element));
        }
        break;
    }
  },

  convertDate(date) {
    let d = new Date(date),
        days      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        year      = d.getFullYear(),
        _month    = d.getMonth(),
        month     = ('' + (_month + 1)).slice(-2),
        day       = d.getDate(),
        hours     = d.getHours(),
        _minutes  = d.getMinutes(),
        minutes   = _minutes > 10 ? _minutes : ('0' + _minutes),
        meridiem  = hours >= 12 ? 'PM' : 'AM',
        _hour     = hours > 12 ? hours - 12 : hours,
        hour      = _hour === 0 ? 12 : _hour,
        timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + minutes + meridiem;

    return timestamp;
  },

  onClickSetActive() {
    $(document).on('click', '.lists-container .list-item', function() {
      let $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
    });
  },

  toggleLists() {
    let $listsContainer = $('.lists-container'),
        $icon = $('.toggle-list-btn .fa');

    $listsContainer.slideToggle('fast');
    $icon.toggleClass('collapsed');
  },

  isMobile(duration) {
    let device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (device) {
      setTimeout(this.toggleLists, duration);
    }

    return;
  },

  sunny() {
    let counter = 0;

    setInterval(function() {
      $('.fa.fa-certificate').css({'-ms-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-moz-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-o-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-webkit-transform': 'rotate(' + counter + 'deg)'})
                       .css({'transform': 'rotate(' + counter + 'deg)'});
      counter += 3;

    }, 100);
  },

  fixPath() {
    if (window.location.hash && window.location.hash === "#_=_") {
      let scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };

      window.location.hash = "";
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  },
});