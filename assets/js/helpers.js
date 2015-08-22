// ===================
// Helpers
// ===================

_.extend(Backbone.View.prototype, {

  windowWidth: $(window).width(),
  mobile: null,
  tablet: null,
  desktop: null,
  $lists: $('.lists'),
  $notes: $('.notes'),

  helpers: {
    init() {
      app.fixPath();
      app.readClient();
      app.setClient();
      app.onClickSetActive();
      app.isMobile(800);
      autosize(document.querySelectorAll('textarea'));
      $('.toggle-list-btn').on('click', function() {
        app.toggleLists();
      });

      $(window).resize(function() {
        app.windowWidth = $(window).width();
        app.setClient();
      });

      $('.active-progress').on('click', function() {
        $(this).toggleClass('show-details');
      });
    }
  },

  readClient() {
    if (app.isMobile()) {
      app.mobile = true;
    }
    else {
      app.mobile = false;
    }

    if (app.windowWidth < 800 && app.windowWidth > 600) {
      app.tablet = true;
      app.desktop = false;
    }
     else if (app.windoWidth >= 800) {
      app.tablet = false;
      app.desktop = true;
    }
  },

  setClient() {
    if (app.windowWidth > 600) {
      app.$notes.removeClass('expanded');
      app.$notes.removeClass('collapsed');
      app.$lists.removeClass('expanded');
      app.$lists.removeClass('collapsed');
      app.stopAnimation();
    }
    else {
      app.$notes.addClass('expanded');
      app.$lists.addClass('collapsed');
      app.animateContainers();
    }
  },

  toggleLists(options={reset:false}) {
    let $listsContainer = $('.lists-container'),
        $icon = $('.toggle-list-btn .fa'),
        $headerContainer = $('.header-container'),
        windowWidth = $(window).width(),
        headerHeight = $headerContainer.outerHeight();

    app.$lists.toggleClass('collapsed');
    app.$lists.toggleClass('expanded');
    app.$notes.toggleClass('expanded');
    app.$notes.toggleClass('collapsed');

    if (app.windowWidth < 600) {
      app.animateContainers();
    }
    else {
      app.stopAnimation();
    }
  },

  animateContainers() {
    if (app.$lists.hasClass('collapsed') && app.$notes.hasClass('expanded')) {
      app.$lists.animate({'marginLeft': '-45%'}, 200);
      app.$notes.animate({'marginRight': '0%'}, 200);
    }
    else if (app.$lists.hasClass('expanded') && app.$notes.hasClass('collapsed')) {
      app.$notes.animate({'marginRight': '-45%'}, 200);
      app.$lists.animate({'marginLeft': '0%'}, 200);
    }
  },

  stopAnimation() {
    app.$notes.animate({'marginRight': '0%'}, 30);
    app.$lists.animate({'marginLeft': '0%'}, 30);
  },

  notify(notification) {
    let $loader = $('.kurt-loader .message');

    $loader.html(notification);
    $loader.removeClass('animated fadeOut');
    $loader.addClass('animated fadeIn');

    setTimeout(function() {
      $loader.removeClass('animated fadeIn');
      $loader.addClass('animated fadeOut');
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
        meridiem  = hours >= 12 ? 'pm' : 'am',
        _hour     = hours > 12 ? hours - 12 : hours,
        hour      = _hour === 0 ? 12 : _hour,
        timestamp =  month + '/' + ' ' + hour + ':' + minutes + meridiem + ' ' + days[d.getDay()];

    return timestamp;
  },

  onClickSetActive() {
    $(document).on('click', '.lists-container .list-item', function() {
      let $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
    });
  },


  isMobile() {
    let device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return device;
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