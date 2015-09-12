const EventHandlers = function(app) {

  let EVENTS = {};

  EVENTS.initializeListeners = function() {
    app.fixPath();
    app.readClient();
    app.setClient();
    app.isMobile();
    autosize(document.querySelectorAll('textarea'));
    addEvent(window, 'resize', app.setClient);
    addEvent(querySelector('.nav-avatar'), 'click', app.toggleUserDropdown);
    addEvent(querySelector('.toggle-list-btn'), 'click', app.toggleLists);
    addEvent(querySelector('.active-progress'), 'click', app.toggleProgressBarDetails);
    addEvent(querySelector('.input-container .icon-container'), 'click', app.toggleIconsContainer);
    app.setListActive();
    app.onNewIconSelect();
  };

  EVENTS.toggleLists = function(options={reset:false}) {
    let notes = document.querySelector('.notes'),
        lists = document.querySelector('.lists'),
        isListsCollapsed = lists.classList.contains('collapsed'),
        isNotesCollapsed = notes.classList.contains('collapsed'),
        isListsExpanded = lists.classList.contains('expanded'),
        isNotesExpanded = notes.classList.contains('expanded'),
        windowX = window.innerWidth;

     toggleClass(lists,  'collapsed', isListsCollapsed);
     toggleClass(lists,  'expanded',  isListsExpanded);
     toggleClass(notes,  'collapsed', isNotesCollapsed);
     toggleClass(notes,  'expanded',  isNotesExpanded);

    if (windowX < 600) {
        app.animateContainers();
    }
    else {
        app.stopAnimation();
    }
  };

  EVENTS.notify = function(notification) {
    let notifier = querySelector('.kurt-loader .message');

    notifier.innerHTML = notification;
    notifier.classList.remove('animated', 'fadeOut');
    notifier.classList.add('animated', 'fadeIn');

    setTimeout(function() {
      notifier.classList.remove('animated', 'fadeIn');
      notifier.classList.add('animated', 'fadeOut');
    }, 1000);
  };

  EVENTS.onNewIconSelect = function() {
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
  };

  EVENTS.toggleIconsContainer = function(e) {
    let dropdown = document.querySelector('.icon-dropdown'),
        isOpen = dropdown.classList.contains('open');

    toggleClass(dropdown, 'open', isOpen);
  };

  EVENTS.setListActive = function() {
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
  };

  EVENTS.isMobile = function() {
    let device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (device) {
        let body = document.querySelector('body');

        body.classList.add('mobile');
    }

    return device;
  };

  EVENTS.readClient = function() {
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
  };

  EVENTS.setClient = function() {
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
  };

  EVENTS.animateContainers = function() {
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
  };

  EVENTS.stopAnimation = function() {
    let lists = document.querySelector('.lists'),
        notes = document.querySelector('.notes');

    notes.style.marginRight = '0%';
    lists.style.marginLeft = '0%';
  };

  EVENTS.toggleProgressBarDetails = function() {
    let progressBar = document.querySelector('.active-progress'),
        isShowing = !!(bar.classList.contains('show-details'));

    toggleClass(progressbar, 'show-details', isShowing);
  };

  EVENTS.toggleUserDropdown = function() {
    let dropdown = document.querySelector('.user-dd-list'),
        isOpen = !!(dropdown.classList.contains('on'));

    toggleClass(dropdown, 'on', isOpen);
  };

  EVENTS.fixPath = function() {
    if (window.location.hash && window.location.hash === "#_=_") {
        let scroll = {
          top  : document.body.scrollTop,
          left : document.body.scrollLeft
        };

        window.location.hash     = "";
        document.body.scrollTop  = scroll.top;
        document.body.scrollLeft = scroll.left;
    }
  };

  EVENTS.hasLengthChanged = function(list) {
    if (app.activeListLength === list.length) {
        return false;
    }
    else {
        app.activeListLength = list.length;
        app.animateListTotal(list);

        return true;
    }
  };

  EVENTS.animateListTotal = function(list) {
    let parent = document.getElementById(list._id),
        target = parent.querySelector('.list-text'),
        isListContainer = target.dataset.length === list._id;

    if (isListContainer) {
        target.classList.remove('fadeInUp');
        target.innerHTML = list.length;
        target.classList.add('fadeOutUp');

        setTimeout(function() {
          target.classList.remove('fadeOutUp');
          target.classList.add('fadeInUp');
        }, 300);
    }
  };

  return _.extend(app, EVENTS);

};