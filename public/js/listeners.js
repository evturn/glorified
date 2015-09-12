// ===================
// Helpers
// ===================
const querySelectorAll = document.querySelectorAll.bind(document);
const querySelector = document.querySelector.bind(document);

_.extend(Backbone.View.prototype, {

  listeners: {
    init() {

      app.fixPath();
      app.readClient();
      app.setClient();
      app.isMobile();
      autosize(document.querySelectorAll('textarea'));
      app.addEvent(window, 'resize', app.setClient);
      app.addEvent(querySelector('.nav-avatar'), 'click', app.toggleUserDropdown);
      app.addEvent(querySelector('.toggle-list-btn'), 'click', app.toggleLists);
      app.addEvent(querySelector('.active-progress'), 'click', app.showProgressBarDetails);
      app.addEvent(querySelector('.input-container .icon-container'), 'click', app.toggleIconsContainer);
      app.setListActive();
      app.onNewIconSelect();
    }
  },
  toggleLists(options={reset:false}) {
    let notes = document.querySelector('.notes'),
        lists = document.querySelector('.lists'),
        isListsCollapsed = lists.classList.contains('collapsed'),
        isNotesCollapsed = notes.classList.contains('collapsed'),
        isListsExpanded = lists.classList.contains('expanded'),
        isNotesExpanded = notes.classList.contains('expanded'),
        windowX = window.innerWidth;

    if (isListsCollapsed) {
      lists.classList.remove('collapsed');
    }
    else {
     lists.classList.add('collapsed');
    }

    if (isListsExpanded) {
      lists.classList.remove('expanded');
    }
    else {
     lists.classList.add('expanded');
    }

    if (isNotesCollapsed) {
      notes.classList.remove('collapsed');
    }
    else {
     notes.classList.add('collapsed');
    }

    if (isNotesExpanded) {
      notes.classList.remove('expanded');
    }
    else {
     notes.classList.add('expanded');
    }

    if (windowX < 600) {
      app.animateContainers();
    }
    else {
      app.stopAnimation();
    }
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
  onNewIconSelect() {
    let nodeList = querySelectorAll('.icon-select .icon-option'),
        icons = [].slice.call(nodeList);

      for (let item of icons) {
        item.addEventListener('click', callback);
      }

    function callback(e) {
      let icon = this.dataset.icon,
          dropdown = document.querySelector('.icon-dropdown'),
          listId = app.activeListId;

      dropdown.classList.remove('open');
      app.updateListIcon(icon);
    };
  },
  toggleIconsContainer(e) {
    let dropdown = document.querySelector('.icon-dropdown'),
        isOpen = dropdown.classList.contains('open');

      if (isOpen) {
          dropdown.classList.remove('open');
      }
      else {
          dropdown.classList.add('open');

      }
  },
  setListActive() {
    let nodeList = querySelectorAll('.list-item'),
        list = [].slice.call(nodeList);

    for (let item of list) {
      item.addEventListener('click', callback);
    }

    function callback(e) {
      for (let item of list) {
        item.classList.remove('active');
      }

      this.classList.add('active');
    };
  },
  addEvent(object, type, callback) {
   function createCallback(fn) {
      let callback = function() {
          fn();
      };

      return callback;
    };

    if (object === null || typeof(object) === 'undefined') {
        return;
    }

    if (object.addEventListener) {
        object.addEventListener(type, createCallback(callback), false);
    }
    else if (object.attachEvent) {
        object.attachEvent('on' + type, createCallback(callback));
    }
    else {
        object['on' + type] = createCallback(callback);
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
    let windowX = window.innerWidth;

    if (app.isMobile()) {
        app.mobileClient = true;
    }
    else {
        app.mobileClient = false;
    }

    if (windowX < 800 && windowX > 600) {
        app.tabletClient = true;
        app.desktopClient = false;
    }
     else if (windowX >= 800) {
        app.tabletClient = false;
        app.desktopClient = true;
    }
  },
  setClient() {
    let notes = document.querySelector('.notes'),
        lists = document.querySelector('.lists'),
        windowX = window.innerWidth;

    if (windowX > 600) {
        notes.classList.remove('expanded', 'collapsed');
        lists.classList.remove('expanded', 'collapsed');
        app.stopAnimation();
    }
    else if (windowX <= 600) {
        notes.classList.add('expanded');
        lists.classList.add('collapsed');
        app.animateContainers();
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
  toggleUserDropdown() {
    let dropdown = document.querySelector('.user-dd-list'),
        isOpen = !!(dropdown.classList.contains('on'));

    if (isOpen) {
        dropdown.classList.remove('on');
    }
    else {
        dropdown.classList.add('on');
    }
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