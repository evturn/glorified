(function(factory) {

  let root = (typeof self === 'object' && self.self === self && self) ||
             (typeof global === 'object' && global.global === global && global);

  if (typeof define === 'function' && define.amd) {
      define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
        root.APP = factory(root, exports, _, $);
      });
  }
  else if (typeof exports !== 'undefined') {
    let _ = require('underscore'), $;

    try {
      $ = require('jquery');
    }
    catch(e) {}

    factory(root, exports, _, $);
  }
  else {
    root.APP = factory(root, {}, root._, (root.jQuery|| root.$));
  }

}(function(root, APP, _, $) {
  let previousAPP = root.APP,
      slice = Array.prototype.slice;

  root = this;
  if (root != null) {
    previousAPP = root.APP;
  }

  APP.noConflict = function () {
      root.APP = previousAPP;
      return APP;
  };


  let APP = {};

  let root, previousAPP;


  APP.listsCollection  = null;
  APP.notesCollection  = null;
  APP.activeListId     = null;
  APP.activeListLength = null;
  APP.mobile           = null;
  APP.user             = null;
  APP.windowX          = window.innerWidth;

  APP.init = function() {
    APP.renderForm();
    APP.buildEnvironment();


  };

  APP.renderForm = function() {
    let $inputs = $('.inputs-container');

    $inputs.html(this.inputTemplate());
    autosize($('textarea'));

    return this;
  };

  APP.getDOMReferences = function() {
    APP.lists          = document.querySelector('.lists');
    APP.notes          = document.querySelector('.notes');
    APP.listInput      = document.querySelector('.list-input');
    APP.noteInput      = document.querySelector('.note-input');
    APP.notesContainer = document.querySelector('.notes-container');
    APP.listsContainer = document.querySelector('.lists-container');
  },

  APP.setUser = function() {
    let user = new RB.User();

    APP.user = user;
  };

  APP.buildEnvironment = function() {
    APP.setUser();
    APP.getDOMReferences();
  };

  APP.renderIcons = function() {
    let container = document.querySelector('.icon-select'),
        icons = '';

    for (let icon of RB.icons) {
      let i    = icon.icon,
          name = icon.name;

      icons = icons + `<div class="icon-option" data-icon="fa ${i}">
                        <i class="animated fadeIn fa ${i}"></i>
                        <p class="caption">${name}</p>
                       </div>`;
    }

    container.innerHTML = icons;
  };

  let E = {};

  E.init = function() {
    E.fixPath();
    E.setClient();
    E.isMobile();
    E.autosizeTextarea();
  };

  E.autosizeTextarea = function() {
    let textareas = document.querySelectorAll('textarea');

    autosize(textareas);
  };

  E.isMobile = function() {
    let device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (device) {
      let body = document.querySelector('body');

      body.classList.add('mobile');
      APP.mobile = true;
    }

    return device;
  };

  E.fixPath = function() {
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

  E.setClient = function() {
    let notes = document.querySelector('.notes'),
        lists = document.querySelector('.lists');

    if (APP.windowX > 600) {
        notes.classList.remove('expanded', 'collapsed');
        lists.classList.remove('expanded', 'collapsed');
        app.stopAnimation();
    }
    else {
        notes.classList.add('expanded');
        lists.classList.add('collapsed');
        app.animateContainers();
    }
  };

  E.animateContainer = function() {
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

  E.stopAnimation = function() {
    let lists = document.querySelector('.lists'),
        notes = document.querySelector('.notes');

    notes.style.marginRight = '0%';
    lists.style.marginLeft = '0%';
  };

  E.eventListeners = function() {
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
}));