// ===================
// Helpers
// ===================

_.extend(Backbone.View.prototype, {

  helpers: {
    init() {
      app.fixPath();
      app.readClient();
      app.setClient();
      app.isMobile();
    }
  },

  listeners: {
    init() {
      autosize(document.querySelectorAll('textarea'));

      $(window).resize(function() {
        app.windowWidth = $(window).width();
        app.setClient();
      });

      $(document).on('click', '.lists-container .list-item', function() {
        let $listItem = $('.list-item');

        $listItem.removeClass('active');
        $(this).addClass('active');
      });

      $(document).on('click', '.toggle-list-btn', function() {
        app.toggleLists();
      });

      $(document).on('click', '.active-progress', function() {
        $('.active-progress').toggleClass('show-details');
      });
    }
  },

  readClient() {
    if (app.isMobile()) {
      app.mobileClient = true;
      app.mobile.init();
    }
    else {
      app.mobileClient = false;
    }

    if (app.windowWidth < 800 && app.windowWidth > 600) {
      app.tabletClient = true;
      app.desktopClient = false;
    }
     else if (app.windoWidth >= 800) {
      app.tabletClient = false;
      app.desktopClient = true;
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
      app.$lists.animate({'marginLeft': '-42%'}, 200);
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

  animateListTotal(list) {
    let $length = $('div').find("[data-length='" + list._id + "']");

    $length.removeClass('fadeInUp');
    $length.text(list.length);
    $length.addClass('fadeOutUp');

    setTimeout(function() {
      $length.removeClass('fadeOutUp');
      $length.addClass('fadeInUp');
      $length.show();

    }, 300);
  },

  hasLengthChanged(list) {
    if (app.activeListLength === list.length) {
      return false;
    }
    else {
      app.activeListLength = list.length;
      app.animateListTotal(list);
      return true;
    }
  },
});