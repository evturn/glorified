// ===================
// Helpers
// ===================

_.extend(Backbone.View.prototype, {


  listeners: {
    init() {
      app.fixPath();
      app.readClient();
      // app.setClient();
      app.isMobile();
      autosize(document.querySelectorAll('textarea'));

      app.addEvent(window, 'resize', app.setClient);
      app.addEvent(document.querySelector('.nav-avatar'), 'click', app.toggleUserDropdown);
      app.addEvent(document.querySelector('.toggle-list-btn'), 'click', app.toggleLists);
      app.addEvent(document.querySelector('.active-progress'), 'click', app.showProgressBarDetails);
      app.setListActive();



      $(document).on('click', '.icon-container .list-icon', function() {
        $('.icon-dropdown').toggleClass('open');
      });

      $(document).on('click', '.icon-select .icon-option', function() {
        let icon = $(this).attr('data-icon'),
            $dropdown = $('.icon-dropdown'),
            $listItemIcon = app.getListItemIconById(app.activeListId);

        $dropdown.removeClass('open');
        app.updateListIcon(icon);
        $listItemIcon.addClass('bounce');
      });
    }
  },
  createCallback(fn) {
    let callback = function() {
        fn();
    };

    return callback;
  },
  addEvent(object, type, callback) {
    if (object === null || typeof(object) === 'undefined') {
      return;
    }

    if (object.addEventListener) {
        object.addEventListener(type, app.createCallback(callback), false);
    }
    else if (object.attachEvent) {
        object.attachEvent('on' + type, app.createCallback(callback));
    }
    else {
        object['on' + type] = app.createCallback(callback);
    }

  },
  isMobile() {
    let device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (device) {
      let body = document.querySelector('body');

      body.classList.add('mobile');
    }

    return device;
  },
  readClient() {
    if (app.isMobile()) {
      app.mobileClient = true;
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
    let notes = document.querySelector('.notes'),
        lists = document.querySelector('.lists');

    console.log('We triggered');
    if (app.windowWidth > 600) {
      notes.classList.remove('expanded', 'collapsed');
      lists.classList.remove('expanded', 'collapsed');
      app.stopAnimation();
    }
    else {
      notes.classList.add('expanded');
      lists.classList.add('collapsed');
      app.animateContainers();
    }
  },
  toggleLists(options={reset:false}) {
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
  setListActive() {
    $(document).on('click', '.list-item', function(e) {
      let nodeList = document.querySelectorAll('.list-item'),
          list = [].slice.call(nodeList);

      for (let el of list) {
        el.classList.remove('active');
      }
      this.classList.add('active');
    });
  },
  showProgressBarDetails() {
    let bar = document.querySelector('.active-progress'),
        isShowing = !!(bar.classList.contains('show-details'));

    if (isShowing) {
        bar.classList.remove('show-details');
    }
    else {
        bar.classList.add('show-details');
    }
  },
  animateContainers() {
    let lists = document.querySelector('.lists'),
        notes = document.querySelector('.notes'),
        isListsCollapsed = lists.classList.contains('collapsed'),
        isNotesCollapsed = notes.classList.contains('collapsed'),
        isListsExpanded = lists.classList.contains('expanded'),
        isNotesExpanded = notes.classList.contains('expanded');

    if (isListsCollapsed && isNotesExpanded) {
        lists.style.marginLeft = '-39%';
        notes.style.marginRight = '0%';
    }
    else if (isListsExpanded && isNotesCollapsed) {
      notes.style.marginRight = '-45%';
      lists.style.marginLeft = '0%';
    }
  },

  stopAnimation() {
    let lists = document.querySelector('.lists'),
        notes = document.querySelector('.notes');

    notes.style.marginRight = '0%';
    lists.style.marginLeft = '0%';
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
        top  : document.body.scrollTop,
        left : document.body.scrollLeft
      };

      window.location.hash     = "";
      document.body.scrollTop  = scroll.top;
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
  toggleUserDropdown() {
    $('.user-dd-list').toggleClass('on');
  }
});