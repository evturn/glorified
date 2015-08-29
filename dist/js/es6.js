'use strict';

var RB = {};

RB.User = Backbone.Model.extend({
  url: '/users',
  idAttribute: '_id'
});

RB.Note = Backbone.Model.extend({
  idAttribute: '_id'
});

RB.List = Backbone.Model.extend({
  idAttribute: '_id',
  url: '/lists'
});

RB.Lists = Backbone.Collection.extend({
  model: RB.List,
  url: '/notes'
});

// Should be converted to User?
RB.Notes = Backbone.Collection.extend({
  model: RB.Note,
  url: '/notes',
  merge: true
});
'use strict';

_.extend(Backbone.View.prototype, {

  authentication: {

    init: function init() {
      app.isUserLocal();

      $('.btn-container .caption a').on('click', function (e) {
        $('.user-registration .inner').addClass('animated fadeOut');
        $('.user-registration').addClass('animated slideOutUp');
      });

      $('.reg-un').on('keyup', function () {
        var username = $('.reg-un').val();
      });

      $('.reg-pw-2').on('keyup', function () {
        app.comparePasswords();
      });
    }
  },

  isUserLocal: function isUserLocal(user) {
    var username = app.user.get('username');

    if (!username) {
      app.promptUser();
    }
  },

  promptUser: function promptUser() {
    var greeting = app.greeting(),
        name = app.user.attributes.firstName;

    $('body').prepend(app.registerTemplate({ greeting: greeting, name: name }));

    return this;
  },

  comparePasswords: function comparePasswords() {
    var pw2 = $('.reg-pw-2').val(),
        pw1 = $('.reg-pw-1').val();

    if (pw2 === pw1) {
      $('.reg-notify .error').hide();
      $('.reg-notify .ready').show();
    } else {
      $('.reg-notify .ready').hide();
      $('.reg-notify .error').show();
    }
  }
});
// ===================
// HTTP
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  start: function start() {
    app.renderForms();
    app.user = new RB.User();
    app.listsCollection = null;
    app.notesCollection = null;
    app.activeListId = null;
    app.activeListLength = null;
    app.mobileClient = null;
    app.tabletClient = null;
    app.desktopClient = null;
    app.windowWidth = $(window).width();
    app.$lists = $('.lists');
    app.$notes = $('.notes');
    app.$listInput = $('.list-input');
    app.$noteInput = $('.note-input');
    app.$notesContainer = $('.notes-container');
    app.$listsContainer = $('.lists-container');
    app.listeners.init();
    app.appendIcons();

    app.user.fetch({
      success: function success(model, response) {
        if (app.user === null) {
          app.user = model;
        }

        if (app.listsCollection === null) {
          app.listsCollection = new RB.Lists(model.attributes.lists);
          app.setLists();
          app.setProgressBars();
        }

        app.authentication.init();
        return app.listsCollection;
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  get: function get() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { listDestroyed: false, _id: false } : arguments[0];

    // listDestroyed : true  DELETE REQUEST (LIST)
    // _id           : true  POST REQUEST   (ALL)

    app.user.fetch({
      success: function success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);

        if (options.listDestroyed) {
          // LIST DESTROYED, no notes to render
          app.setLists();
          app.setProgressBars();
        } else if (options._id) {
          // NOTE CREATED, render all and render notes
          app.activeListId = options._id;
          app.setActiveListId(options._id);
          app.setLists();
          app.setNotes(options._id);
          app.setProgressBars();
        } else {
          // NOTE UPDATED
          app.setNotes(app.activeListId);
          app.resetActiveList(app.activeListId);
          app.setProgressBars();
        }
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  post: function post(model) {
    $.ajax({
      url: '/notes/',
      method: 'POST',
      data: model,
      success: function success(model, response) {
        app.$noteInput.val('').focus();
        app.validate();
        app.notify(response);
        app.get({ _id: model._id });
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  put: function put(model, attributes, view) {
    var id = model.get('_id');

    model.save(attributes, {
      url: '/notes/' + id,
      success: function success(model, response) {
        app.notify('Updated');
        app.get();
      },
      error: function error(_error) {
        console.log('error ', _error);
      }
    });
  },

  destroy: function destroy(model) {
    var id = model.get('_id');

    model.set('listId', app.activeListId);

    if (id !== null) {
      model.destroy({
        // Change route to '/lists/:id/notes/:id'
        url: '/notes/' + id + '?listId=' + app.activeListId,
        success: function success(model, response) {
          console.log('success ', model);
          app.notify('Removed');
          app.get();
        },
        error: function error(err) {
          console.log('error ', err);
        }
      });
    }
  },

  list: {

    put: function put(model, attributes) {
      var id = model.get('_id');

      model.save(attributes, {
        url: '/lists/' + id,
        success: function success(model, response) {
          app.notify('Updated');
          app.get();
        },
        error: function error(_error2) {
          console.log('error ', _error2);
        }
      });
    },

    destroy: function destroy(model, id) {
      if (id !== null) {
        model.destroy({
          url: '/lists/' + id,
          success: function success(model, response) {
            console.log('success ', model);
            app.removeListItemById(id);
            app.notify('Removed');
            app.get({ listDestroyed: true });
            app.createList();
          },
          error: function error(err) {
            console.log('error ', err);
          }
        });
      }
    }
  }
});
// ===================
// View Helpers
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  getActiveListId: function getActiveListId() {
    var id = app.activeListId;

    return id;
  },

  setActiveListId: function setActiveListId(id) {
    // Too small of a utility and possibly redundant
    app.$notesContainer.attr('data-list', id);
    app.activeListId = id;

    return this;
  },

  getListContainerById: function getListContainerById(id) {
    var $listItem = $('.list-item .inner-container');

    return $listItem.find("[data-id='" + id + "']");
  },

  getListItemIconById: function getListItemIconById(id) {
    return $('div').find("[data-list-item-icon='" + id + "']");
  },

  removeListItemById: function removeListItemById(id) {
    var $container = app.getListContainerById(id);

    $container.parent().remove();
  },

  setListValue: function setListValue(listname) {
    app.$listInput.val(listname);
  },

  resetActiveList: function resetActiveList(id) {
    var $listItem = $('.list-item'),
        $element = $('div').find("[data-id='" + id + "']");

    $listItem.removeClass('active');
    $element.parent().addClass('active');

    return $element;
  },

  renderForms: function renderForms() {
    var $inputs = $('.inputs-container');

    $inputs.html(this.inputTemplate());
    autosize($('textarea'));

    return this;
  },

  renderActiveProgressBar: function renderActiveProgressBar(id) {
    var collection = app.notesCollection,
        $barContainer = $('.active-progress'),
        _id = id,
        length = collection.length,
        notDone = collection.where({ done: false }).length,
        done = length - notDone,
        notDonePct = notDone / length * 100 + '%',
        notDoneText = parseInt(notDonePct).toFixed(0) + '%',
        donePct = done / length * 100 + '%',
        doneText = parseInt(donePct).toFixed(0) + '%',
        data = {
      name: name,
      _id: _id,
      length: length,
      notDone: notDone,
      notDonePct: notDonePct,
      notDoneText: notDoneText,
      done: done,
      donePct: donePct,
      doneText: doneText
    };

    if ($barContainer.children().length === 0) {
      $barContainer.html(app.progressBarTemplate(data));
    }

    var $done = $('#list-progress').find("[data-done='" + data._id + "']"),
        $notDone = $('#list-progress').find("[data-notDone='" + data._id + "']"),
        $notDoneText = $('.not-done-text'),
        $doneText = $('.done-text');

    $done.css({ 'width': data.donePct });
    $notDone.css({ 'width': data.notDonePct });
    $doneText.html(data.doneText);
    $notDoneText.html(data.notDoneText);

    if (app.activeListId && app.activeListId === data._id) {
      app.hasLengthChanged(data);
    }
  },

  setProgressBars: function setProgressBars() {
    var listData = [],
        i = 0;

    app.listsCollection.each(function (list) {
      var _id = list.id,
          name = list.attributes.name,
          collection = new RB.Notes(list.attributes.notes),
          length = collection.length,
          notDone = collection.where({ done: false }).length,
          done = length - notDone,
          notDonePct = notDone / length * 100 + '%',
          donePct = done / length * 100 + '%',
          data = {
        name: name,
        _id: _id,
        length: length,
        notDone: notDone,
        notDonePct: notDonePct,
        done: done,
        donePct: donePct
      };

      listData.push(data);
      collection.stopListening();
      i++;
    });

    listData.forEach(function (list) {
      var $done = $('div').find("[data-done='" + list._id + "']"),
          $notDone = $('div').find("[data-notDone='" + list._id + "']");

      $done.css({ 'width': list.donePct });
      $notDone.css({ 'width': list.notDonePct });

      if (app.activeListId && app.activeListId === list._id) {
        app.hasLengthChanged(list);
      }
    });
  },

  tojquery: function tojquery(element) {
    switch (typeof element) {
      case "object":
        if (element instanceof jQuery) {
          return element;
        }
        break;
      case "string":
        if (element.charAt(0) === '.') {
          return $(element);
        } else {
          return $(document.getElementsByClassName(element));
        }
        break;
    }
  },

  convertDate: function convertDate(date) {
    var d = new Date(date),
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        year = d.getFullYear(),
        _month = d.getMonth(),
        month = ('' + (_month + 1)).slice(-2),
        day = d.getDate(),
        hours = d.getHours(),
        _minutes = d.getMinutes(),
        minutes = _minutes > 10 ? _minutes : '0' + _minutes,
        meridiem = hours >= 12 ? 'pm' : 'am',
        _hour = hours > 12 ? hours - 12 : hours,
        hour = _hour === 0 ? 12 : _hour,
        timestamp = month + '/' + day + ' ' + hour + ':' + minutes + meridiem + ' ' + days[d.getDay()];

    return timestamp;
  },

  appendIconSelect: function appendIconSelect(icon) {
    $('.icon-select').append(app.iconSelectTemplate(icon));

    return this;
  },

  appendIcons: function appendIcons() {
    app.icons.forEach(function (icon) {
      app.appendIconSelect(icon);
    });
  },

  icons: [{ icon: 'fa-glass', name: 'glass' }, { icon: 'fa-music', name: 'music' }, { icon: 'fa-search', name: 'search' }, { icon: 'fa-envelope-o', name: 'envelope-o' }, { icon: 'fa-heart', name: 'heart' }, { icon: 'fa-star', name: 'star' }, { icon: 'fa-star-o', name: 'star-o' }, { icon: 'fa-user', name: 'user' }, { icon: 'fa-film', name: 'film' }, { icon: 'fa-th-large', name: 'th-large' }, { icon: 'fa-th', name: 'th' }, { icon: 'fa-th-list', name: 'th-list' }, { icon: 'fa-check', name: 'check' }, { icon: 'fa-remove', name: 'remove' }, { icon: 'fa-close', name: 'close' }, { icon: 'fa-times', name: 'times' }, { icon: 'fa-search-plus', name: 'search-plus' }, { icon: 'fa-search-minus', name: 'search-minus' }, { icon: 'fa-power-off', name: 'power-off' }, { icon: 'fa-signal', name: 'signal' }, { icon: 'fa-gear', name: 'gear' }, { icon: 'fa-cog', name: 'cog' }, { icon: 'fa-trash-o', name: 'trash-o' }, { icon: 'fa-home', name: 'home' }, { icon: 'fa-file-o', name: 'file-o' }, { icon: 'fa-clock-o', name: 'clock-o' }, { icon: 'fa-road', name: 'road' }, { icon: 'fa-download', name: 'download' }, { icon: 'fa-arrow-circle-o-down', name: 'arrow-circle-o-down' }, { icon: 'fa-arrow-circle-o-up', name: 'arrow-circle-o-up' }, { icon: 'fa-inbox', name: 'inbox' }, { icon: 'fa-play-circle-o', name: 'play-circle-o' }, { icon: 'fa-rotate-right', name: 'rotate-right' }, { icon: 'fa-repeat', name: 'repeat' }, { icon: 'fa-refresh', name: 'refresh' }, { icon: 'fa-list-alt', name: 'list-alt' }, { icon: 'fa-lock', name: 'lock' }, { icon: 'fa-flag', name: 'flag' }, { icon: 'fa-headphones', name: 'headphones' }, { icon: 'fa-volume-off', name: 'volume-off' }, { icon: 'fa-volume-down', name: 'volume-down' }, { icon: 'fa-volume-up', name: 'volume-up' }, { icon: 'fa-qrcode', name: 'qrcode' }, { icon: 'fa-barcode', name: 'barcode' }, { icon: 'fa-tag', name: 'tag' }, { icon: 'fa-tags', name: 'tags' }, { icon: 'fa-book', name: 'book' }, { icon: 'fa-bookmark', name: 'bookmark' }, { icon: 'fa-print', name: 'print' }, { icon: 'fa-camera', name: 'camera' }, { icon: 'fa-font', name: 'font' }, { icon: 'fa-bold', name: 'bold' }, { icon: 'fa-italic', name: 'italic' }, { icon: 'fa-text-height', name: 'text-height' }, { icon: 'fa-text-width', name: 'text-width' }, { icon: 'fa-align-left', name: 'align-left' }, { icon: 'fa-align-center', name: 'align-center' }, { icon: 'fa-align-right', name: 'align-right' }, { icon: 'fa-align-justify', name: 'align-justify' }, { icon: 'fa-list', name: 'list' }, { icon: 'fa-dedent', name: 'dedent' }, { icon: 'fa-outdent', name: 'outdent' }, { icon: 'fa-indent', name: 'indent' }, { icon: 'fa-video-camera', name: 'video-camera' }, { icon: 'fa-photo', name: 'photo' }, { icon: 'fa-image', name: 'image' }, { icon: 'fa-picture-o', name: 'picture-o' }, { icon: 'fa-pencil', name: 'pencil' }, { icon: 'fa-map-marker', name: 'map-marker' }, { icon: 'fa-adjust', name: 'adjust' }, { icon: 'fa-tint', name: 'tint' }, { icon: 'fa-edit', name: 'edit' }, { icon: 'fa-pencil-square-o', name: 'pencil-square-o' }, { icon: 'fa-share-square-o', name: 'share-square-o' }, { icon: 'fa-check-square-o', name: 'check-square-o' }, { icon: 'fa-arrows', name: 'arrows' }, { icon: 'fa-step-backward', name: 'step-backward' }, { icon: 'fa-fast-backward', name: 'fast-backward' }, { icon: 'fa-backward', name: 'backward' }, { icon: 'fa-play', name: 'play' }, { icon: 'fa-pause', name: 'pause' }, { icon: 'fa-stop', name: 'stop' }, { icon: 'fa-forward', name: 'forward' }, { icon: 'fa-fast-forward', name: 'fast-forward' }, { icon: 'fa-step-forward', name: 'step-forward' }, { icon: 'fa-eject', name: 'eject' }, { icon: 'fa-chevron-left', name: 'chevron-left' }, { icon: 'fa-chevron-right', name: 'chevron-right' }, { icon: 'fa-plus-circle', name: 'plus-circle' }, { icon: 'fa-minus-circle', name: 'minus-circle' }, { icon: 'fa-times-circle', name: 'times-circle' }, { icon: 'fa-check-circle', name: 'check-circle' }, { icon: 'fa-question-circle', name: 'question-circle' }, { icon: 'fa-info-circle', name: 'info-circle' }, { icon: 'fa-crosshairs', name: 'crosshairs' }, { icon: 'fa-times-circle-o', name: 'times-circle-o' }, { icon: 'fa-check-circle-o', name: 'check-circle-o' }, { icon: 'fa-ban', name: 'ban' }, { icon: 'fa-arrow-left', name: 'arrow-left' }, { icon: 'fa-arrow-right', name: 'arrow-right' }, { icon: 'fa-arrow-up', name: 'arrow-up' }, { icon: 'fa-arrow-down', name: 'arrow-down' }, { icon: 'fa-mail-forward', name: 'mail-forward' }, { icon: 'fa-share', name: 'share' }, { icon: 'fa-expand', name: 'expand' }, { icon: 'fa-compress', name: 'compress' }, { icon: 'fa-plus', name: 'plus' }, { icon: 'fa-minus', name: 'minus' }, { icon: 'fa-asterisk', name: 'asterisk' }, { icon: 'fa-exclamation-circle', name: 'exclamation-circle' }, { icon: 'fa-gift', name: 'gift' }, { icon: 'fa-leaf', name: 'leaf' }, { icon: 'fa-fire', name: 'fire' }, { icon: 'fa-eye', name: 'eye' }, { icon: 'fa-eye-slash', name: 'eye-slash' }, { icon: 'fa-warning', name: 'warning' }, { icon: 'fa-exclamation-triangle', name: 'exclamation-triangle' }, { icon: 'fa-plane', name: 'plane' }, { icon: 'fa-calendar', name: 'calendar' }, { icon: 'fa-random', name: 'random' }, { icon: 'fa-comment', name: 'comment' }, { icon: 'fa-magnet', name: 'magnet' }, { icon: 'fa-chevron-up', name: 'chevron-up' }, { icon: 'fa-chevron-down', name: 'chevron-down' }, { icon: 'fa-retweet', name: 'retweet' }, { icon: 'fa-shopping-cart', name: 'shopping-cart' }, { icon: 'fa-folder', name: 'folder' }, { icon: 'fa-folder-open', name: 'folder-open' }, { icon: 'fa-arrows-v', name: 'arrows-v' }, { icon: 'fa-arrows-h', name: 'arrows-h' }, { icon: 'fa-bar-chart-o', name: 'bar-chart-o' }, { icon: 'fa-bar-chart', name: 'bar-chart' }, { icon: 'fa-twitter-square', name: 'twitter-square' }, { icon: 'fa-facebook-square', name: 'facebook-square' }, { icon: 'fa-camera-retro', name: 'camera-retro' }, { icon: 'fa-key', name: 'key' }, { icon: 'fa-gears', name: 'gears' }, { icon: 'fa-cogs', name: 'cogs' }, { icon: 'fa-comments', name: 'comments' }, { icon: 'fa-thumbs-o-up', name: 'thumbs-o-up' }, { icon: 'fa-thumbs-o-down', name: 'thumbs-o-down' }, { icon: 'fa-star-half', name: 'star-half' }, { icon: 'fa-heart-o', name: 'heart-o' }, { icon: 'fa-sign-out', name: 'sign-out' }, { icon: 'fa-linkedin-square', name: 'linkedin-square' }, { icon: 'fa-thumb-tack', name: 'thumb-tack' }, { icon: 'fa-external-link', name: 'external-link' }, { icon: 'fa-sign-in', name: 'sign-in' }, { icon: 'fa-trophy', name: 'trophy' }, { icon: 'fa-github-square', name: 'github-square' }, { icon: 'fa-upload', name: 'upload' }, { icon: 'fa-lemon-o', name: 'lemon-o' }, { icon: 'fa-phone', name: 'phone' }, { icon: 'fa-square-o', name: 'square-o' }, { icon: 'fa-bookmark-o', name: 'bookmark-o' }, { icon: 'fa-phone-square', name: 'phone-square' }, { icon: 'fa-twitter', name: 'twitter' }, { icon: 'fa-facebook-f', name: 'facebook-f' }, { icon: 'fa-facebook', name: 'facebook' }, { icon: 'fa-github', name: 'github' }, { icon: 'fa-unlock', name: 'unlock' }, { icon: 'fa-credit-card', name: 'credit-card' }, { icon: 'fa-rss', name: 'rss' }, { icon: 'fa-hdd-o', name: 'hdd-o' }, { icon: 'fa-bullhorn', name: 'bullhorn' }, { icon: 'fa-bell', name: 'bell' }, { icon: 'fa-certificate', name: 'certificate' }, { icon: 'fa-hand-o-right', name: 'hand-o-right' }, { icon: 'fa-hand-o-left', name: 'hand-o-left' }, { icon: 'fa-hand-o-up', name: 'hand-o-up' }, { icon: 'fa-hand-o-down', name: 'hand-o-down' }, { icon: 'fa-arrow-circle-left', name: 'arrow-circle-left' }, { icon: 'fa-arrow-circle-right', name: 'arrow-circle-right' }, { icon: 'fa-arrow-circle-up', name: 'arrow-circle-up' }, { icon: 'fa-arrow-circle-down', name: 'arrow-circle-down' }, { icon: 'fa-globe', name: 'globe' }, { icon: 'fa-wrench', name: 'wrench' }, { icon: 'fa-tasks', name: 'tasks' }, { icon: 'fa-filter', name: 'filter' }, { icon: 'fa-briefcase', name: 'briefcase' }, { icon: 'fa-arrows-alt', name: 'arrows-alt' }, { icon: 'fa-group', name: 'group' }, { icon: 'fa-users', name: 'users' }, { icon: 'fa-chain', name: 'chain' }, { icon: 'fa-link', name: 'link' }, { icon: 'fa-cloud', name: 'cloud' }, { icon: 'fa-flask', name: 'flask' }, { icon: 'fa-cut', name: 'cut' }, { icon: 'fa-scissors', name: 'scissors' }, { icon: 'fa-copy', name: 'copy' }, { icon: 'fa-files-o', name: 'files-o' }, { icon: 'fa-paperclip', name: 'paperclip' }, { icon: 'fa-save', name: 'save' }, { icon: 'fa-floppy-o', name: 'floppy-o' }, { icon: 'fa-square', name: 'square' }, { icon: 'fa-navicon', name: 'navicon' }, { icon: 'fa-reorder', name: 'reorder' }, { icon: 'fa-bars', name: 'bars' }, { icon: 'fa-list-ul', name: 'list-ul' }, { icon: 'fa-list-ol', name: 'list-ol' }, { icon: 'fa-strikethrough', name: 'strikethrough' }, { icon: 'fa-underline', name: 'underline' }, { icon: 'fa-table', name: 'table' }, { icon: 'fa-magic', name: 'magic' }, { icon: 'fa-truck', name: 'truck' }, { icon: 'fa-pinterest', name: 'pinterest' }, { icon: 'fa-pinterest-square', name: 'pinterest-square' }, { icon: 'fa-google-plus-square', name: 'google-plus-square' }, { icon: 'fa-google-plus', name: 'google-plus' }, { icon: 'fa-money', name: 'money' }, { icon: 'fa-caret-down', name: 'caret-down' }, { icon: 'fa-caret-up', name: 'caret-up' }, { icon: 'fa-caret-left', name: 'caret-left' }, { icon: 'fa-caret-right', name: 'caret-right' }, { icon: 'fa-columns', name: 'columns' }, { icon: 'fa-unsorted', name: 'unsorted' }, { icon: 'fa-sort', name: 'sort' }, { icon: 'fa-sort-down', name: 'sort-down' }, { icon: 'fa-sort-desc', name: 'sort-desc' }, { icon: 'fa-sort-up', name: 'sort-up' }, { icon: 'fa-sort-asc', name: 'sort-asc' }, { icon: 'fa-envelope', name: 'envelope' }, { icon: 'fa-linkedin', name: 'linkedin' }, { icon: 'fa-rotate-left', name: 'rotate-left' }, { icon: 'fa-undo', name: 'undo' }, { icon: 'fa-legal', name: 'legal' }, { icon: 'fa-gavel', name: 'gavel' }, { icon: 'fa-dashboard', name: 'dashboard' }, { icon: 'fa-tachometer', name: 'tachometer' }, { icon: 'fa-comment-o', name: 'comment-o' }, { icon: 'fa-comments-o', name: 'comments-o' }, { icon: 'fa-flash', name: 'flash' }, { icon: 'fa-bolt', name: 'bolt' }, { icon: 'fa-sitemap', name: 'sitemap' }, { icon: 'fa-umbrella', name: 'umbrella' }, { icon: 'fa-paste', name: 'paste' }, { icon: 'fa-clipboard', name: 'clipboard' }, { icon: 'fa-lightbulb-o', name: 'lightbulb-o' }, { icon: 'fa-exchange', name: 'exchange' }, { icon: 'fa-cloud-download', name: 'cloud-download' }, { icon: 'fa-cloud-upload', name: 'cloud-upload' }, { icon: 'fa-user-md', name: 'user-md' }, { icon: 'fa-stethoscope', name: 'stethoscope' }, { icon: 'fa-suitcase', name: 'suitcase' }, { icon: 'fa-bell-o', name: 'bell-o' }, { icon: 'fa-coffee', name: 'coffee' }, { icon: 'fa-cutlery', name: 'cutlery' }, { icon: 'fa-file-text-o', name: 'file-text-o' }, { icon: 'fa-building-o', name: 'building-o' }, { icon: 'fa-hospital-o', name: 'hospital-o' }, { icon: 'fa-ambulance', name: 'ambulance' }, { icon: 'fa-medkit', name: 'medkit' }, { icon: 'fa-fighter-jet', name: 'fighter-jet' }, { icon: 'fa-beer', name: 'beer' }, { icon: 'fa-h-square', name: 'h-square' }, { icon: 'fa-plus-square', name: 'plus-square' }, { icon: 'fa-angle-double-left', name: 'angle-double-left' }, { icon: 'fa-angle-double-right', name: 'angle-double-right' }, { icon: 'fa-angle-double-up', name: 'angle-double-up' }, { icon: 'fa-angle-double-down', name: 'angle-double-down' }, { icon: 'fa-angle-left', name: 'angle-left' }, { icon: 'fa-angle-right', name: 'angle-right' }, { icon: 'fa-angle-up', name: 'angle-up' }, { icon: 'fa-angle-down', name: 'angle-down' }, { icon: 'fa-desktop', name: 'desktop' }, { icon: 'fa-laptop', name: 'laptop' }, { icon: 'fa-tablet', name: 'tablet' }, { icon: 'fa-mobile-phone', name: 'mobile-phone' }, { icon: 'fa-mobile', name: 'mobile' }, { icon: 'fa-circle-o', name: 'circle-o' }, { icon: 'fa-quote-left', name: 'quote-left' }, { icon: 'fa-quote-right', name: 'quote-right' }, { icon: 'fa-spinner', name: 'spinner' }, { icon: 'fa-circle', name: 'circle' }, { icon: 'fa-mail-reply', name: 'mail-reply' }, { icon: 'fa-reply', name: 'reply' }, { icon: 'fa-github-alt', name: 'github-alt' }, { icon: 'fa-folder-o', name: 'folder-o' }, { icon: 'fa-folder-open-o', name: 'folder-open-o' }, { icon: 'fa-smile-o', name: 'smile-o' }, { icon: 'fa-frown-o', name: 'frown-o' }, { icon: 'fa-meh-o', name: 'meh-o' }, { icon: 'fa-gamepad', name: 'gamepad' }, { icon: 'fa-keyboard-o', name: 'keyboard-o' }, { icon: 'fa-flag-o', name: 'flag-o' }, { icon: 'fa-flag-checkered', name: 'flag-checkered' }, { icon: 'fa-terminal', name: 'terminal' }, { icon: 'fa-code', name: 'code' }, { icon: 'fa-mail-reply-all', name: 'mail-reply-all' }, { icon: 'fa-reply-all', name: 'reply-all' }, { icon: 'fa-star-half-empty', name: 'star-half-empty' }, { icon: 'fa-star-half-full', name: 'star-half-full' }, { icon: 'fa-star-half-o', name: 'star-half-o' }, { icon: 'fa-location-arrow', name: 'location-arrow' }, { icon: 'fa-crop', name: 'crop' }, { icon: 'fa-code-fork', name: 'code-fork' }, { icon: 'fa-unlink', name: 'unlink' }, { icon: 'fa-chain-broken', name: 'chain-broken' }, { icon: 'fa-question', name: 'question' }, { icon: 'fa-info', name: 'info' }, { icon: 'fa-exclamation', name: 'exclamation' }, { icon: 'fa-superscript', name: 'superscript' }, { icon: 'fa-subscript', name: 'subscript' }, { icon: 'fa-eraser', name: 'eraser' }, { icon: 'fa-puzzle-piece', name: 'puzzle-piece' }, { icon: 'fa-microphone', name: 'microphone' }, { icon: 'fa-microphone-slash', name: 'microphone-slash' }, { icon: 'fa-shield', name: 'shield' }, { icon: 'fa-calendar-o', name: 'calendar-o' }, { icon: 'fa-fire-extinguisher', name: 'fire-extinguisher' }, { icon: 'fa-rocket', name: 'rocket' }, { icon: 'fa-maxcdn', name: 'maxcdn' }, { icon: 'fa-chevron-circle-left', name: 'chevron-circle-left' }, { icon: 'fa-chevron-circle-right', name: 'chevron-circle-right' }, { icon: 'fa-chevron-circle-up', name: 'chevron-circle-up' }, { icon: 'fa-chevron-circle-down', name: 'chevron-circle-down' }, { icon: 'fa-html5', name: 'html5' }, { icon: 'fa-css3', name: 'css3' }, { icon: 'fa-anchor', name: 'anchor' }, { icon: 'fa-unlock-alt', name: 'unlock-alt' }, { icon: 'fa-bullseye', name: 'bullseye' }, { icon: 'fa-ellipsis-h', name: 'ellipsis-h' }, { icon: 'fa-ellipsis-v', name: 'ellipsis-v' }, { icon: 'fa-rss-square', name: 'rss-square' }, { icon: 'fa-play-circle', name: 'play-circle' }, { icon: 'fa-ticket', name: 'ticket' }, { icon: 'fa-minus-square', name: 'minus-square' }, { icon: 'fa-minus-square-o', name: 'minus-square-o' }, { icon: 'fa-level-up', name: 'level-up' }, { icon: 'fa-level-down', name: 'level-down' }, { icon: 'fa-check-square', name: 'check-square' }, { icon: 'fa-pencil-square', name: 'pencil-square' }, { icon: 'fa-external-link-square', name: 'external-link-square' }, { icon: 'fa-share-square', name: 'share-square' }, { icon: 'fa-compass', name: 'compass' }, { icon: 'fa-toggle-down', name: 'toggle-down' }, { icon: 'fa-caret-square-o-down', name: 'caret-square-o-down' }, { icon: 'fa-toggle-up', name: 'toggle-up' }, { icon: 'fa-caret-square-o-up', name: 'caret-square-o-up' }, { icon: 'fa-toggle-right', name: 'toggle-right' }, { icon: 'fa-caret-square-o-right', name: 'caret-square-o-right' }, { icon: 'fa-euro', name: 'euro' }, { icon: 'fa-eur', name: 'eur' }, { icon: 'fa-gbp', name: 'gbp' }, { icon: 'fa-dollar', name: 'dollar' }, { icon: 'fa-usd', name: 'usd' }, { icon: 'fa-rupee', name: 'rupee' }, { icon: 'fa-inr', name: 'inr' }, { icon: 'fa-cny', name: 'cny' }, { icon: 'fa-rmb', name: 'rmb' }, { icon: 'fa-yen', name: 'yen' }, { icon: 'fa-jpy', name: 'jpy' }, { icon: 'fa-ruble', name: 'ruble' }, { icon: 'fa-rouble', name: 'rouble' }, { icon: 'fa-rub', name: 'rub' }, { icon: 'fa-won', name: 'won' }, { icon: 'fa-krw', name: 'krw' }, { icon: 'fa-bitcoin', name: 'bitcoin' }, { icon: 'fa-btc', name: 'btc' }, { icon: 'fa-file', name: 'file' }, { icon: 'fa-file-text', name: 'file-text' }, { icon: 'fa-sort-alpha-asc', name: 'sort-alpha-asc' }, { icon: 'fa-sort-alpha-desc', name: 'sort-alpha-desc' }, { icon: 'fa-sort-amount-asc', name: 'sort-amount-asc' }, { icon: 'fa-sort-amount-desc', name: 'sort-amount-desc' }, { icon: 'fa-sort-numeric-asc', name: 'sort-numeric-asc' }, { icon: 'fa-sort-numeric-desc', name: 'sort-numeric-desc' }, { icon: 'fa-thumbs-up', name: 'thumbs-up' }, { icon: 'fa-thumbs-down', name: 'thumbs-down' }, { icon: 'fa-youtube-square', name: 'youtube-square' }, { icon: 'fa-youtube', name: 'youtube' }, { icon: 'fa-xing', name: 'xing' }, { icon: 'fa-xing-square', name: 'xing-square' }, { icon: 'fa-youtube-play', name: 'youtube-play' }, { icon: 'fa-dropbox', name: 'dropbox' }, { icon: 'fa-stack-overflow', name: 'stack-overflow' }, { icon: 'fa-instagram', name: 'instagram' }, { icon: 'fa-flickr', name: 'flickr' }, { icon: 'fa-adn', name: 'adn' }, { icon: 'fa-bitbucket', name: 'bitbucket' }, { icon: 'fa-bitbucket-square', name: 'bitbucket-square' }, { icon: 'fa-tumblr', name: 'tumblr' }, { icon: 'fa-tumblr-square', name: 'tumblr-square' }, { icon: 'fa-long-arrow-down', name: 'long-arrow-down' }, { icon: 'fa-long-arrow-up', name: 'long-arrow-up' }, { icon: 'fa-long-arrow-left', name: 'long-arrow-left' }, { icon: 'fa-long-arrow-right', name: 'long-arrow-right' }, { icon: 'fa-apple', name: 'apple' }, { icon: 'fa-windows', name: 'windows' }, { icon: 'fa-android', name: 'android' }, { icon: 'fa-linux', name: 'linux' }, { icon: 'fa-dribbble', name: 'dribbble' }, { icon: 'fa-skype', name: 'skype' }, { icon: 'fa-foursquare', name: 'foursquare' }, { icon: 'fa-trello', name: 'trello' }, { icon: 'fa-female', name: 'female' }, { icon: 'fa-male', name: 'male' }, { icon: 'fa-gittip', name: 'gittip' }, { icon: 'fa-gratipay', name: 'gratipay' }, { icon: 'fa-sun-o', name: 'sun-o' }, { icon: 'fa-moon-o', name: 'moon-o' }, { icon: 'fa-archive', name: 'archive' }, { icon: 'fa-bug', name: 'bug' }, { icon: 'fa-vk', name: 'vk' }, { icon: 'fa-weibo', name: 'weibo' }, { icon: 'fa-renren', name: 'renren' }, { icon: 'fa-pagelines', name: 'pagelines' }, { icon: 'fa-stack-exchange', name: 'stack-exchange' }, { icon: 'fa-arrow-circle-o-right', name: 'arrow-circle-o-right' }, { icon: 'fa-arrow-circle-o-left', name: 'arrow-circle-o-left' }, { icon: 'fa-toggle-left', name: 'toggle-left' }, { icon: 'fa-caret-square-o-left', name: 'caret-square-o-left' }, { icon: 'fa-dot-circle-o', name: 'dot-circle-o' }, { icon: 'fa-wheelchair', name: 'wheelchair' }, { icon: 'fa-vimeo-square', name: 'vimeo-square' }, { icon: 'fa-turkish-lira', name: 'turkish-lira' }, { icon: 'fa-try', name: 'try' }, { icon: 'fa-plus-square-o', name: 'plus-square-o' }, { icon: 'fa-space-shuttle', name: 'space-shuttle' }, { icon: 'fa-slack', name: 'slack' }, { icon: 'fa-envelope-square', name: 'envelope-square' }, { icon: 'fa-wordpress', name: 'wordpress' }, { icon: 'fa-openid', name: 'openid' }, { icon: 'fa-institution', name: 'institution' }, { icon: 'fa-bank', name: 'bank' }, { icon: 'fa-university', name: 'university' }, { icon: 'fa-mortar-board', name: 'mortar-board' }, { icon: 'fa-graduation-cap', name: 'graduation-cap' }, { icon: 'fa-yahoo', name: 'yahoo' }, { icon: 'fa-google', name: 'google' }, { icon: 'fa-reddit', name: 'reddit' }, { icon: 'fa-reddit-square', name: 'reddit-square' }, { icon: 'fa-stumbleupon-circle', name: 'stumbleupon-circle' }, { icon: 'fa-stumbleupon', name: 'stumbleupon' }, { icon: 'fa-delicious', name: 'delicious' }, { icon: 'fa-digg', name: 'digg' }, { icon: 'fa-pied-piper', name: 'pied-piper' }, { icon: 'fa-pied-piper-alt', name: 'pied-piper-alt' }, { icon: 'fa-drupal', name: 'drupal' }, { icon: 'fa-joomla', name: 'joomla' }, { icon: 'fa-language', name: 'language' }, { icon: 'fa-fax', name: 'fax' }, { icon: 'fa-building', name: 'building' }, { icon: 'fa-child', name: 'child' }, { icon: 'fa-paw', name: 'paw' }, { icon: 'fa-spoon', name: 'spoon' }, { icon: 'fa-cube', name: 'cube' }, { icon: 'fa-cubes', name: 'cubes' }, { icon: 'fa-behance', name: 'behance' }, { icon: 'fa-behance-square', name: 'behance-square' }, { icon: 'fa-steam', name: 'steam' }, { icon: 'fa-steam-square', name: 'steam-square' }, { icon: 'fa-recycle', name: 'recycle' }, { icon: 'fa-automobile', name: 'automobile' }, { icon: 'fa-car', name: 'car' }, { icon: 'fa-cab', name: 'cab' }, { icon: 'fa-taxi', name: 'taxi' }, { icon: 'fa-tree', name: 'tree' }, { icon: 'fa-spotify', name: 'spotify' }, { icon: 'fa-deviantart', name: 'deviantart' }, { icon: 'fa-soundcloud', name: 'soundcloud' }, { icon: 'fa-database', name: 'database' }, { icon: 'fa-file-pdf-o', name: 'file-pdf-o' }, { icon: 'fa-file-word-o', name: 'file-word-o' }, { icon: 'fa-file-excel-o', name: 'file-excel-o' }, { icon: 'fa-file-powerpoint-o', name: 'file-powerpoint-o' }, { icon: 'fa-file-photo-o', name: 'file-photo-o' }, { icon: 'fa-file-picture-o', name: 'file-picture-o' }, { icon: 'fa-file-image-o', name: 'file-image-o' }, { icon: 'fa-file-zip-o', name: 'file-zip-o' }, { icon: 'fa-file-archive-o', name: 'file-archive-o' }, { icon: 'fa-file-sound-o', name: 'file-sound-o' }, { icon: 'fa-file-audio-o', name: 'file-audio-o' }, { icon: 'fa-file-movie-o', name: 'file-movie-o' }, { icon: 'fa-file-video-o', name: 'file-video-o' }, { icon: 'fa-file-code-o', name: 'file-code-o' }, { icon: 'fa-vine', name: 'vine' }, { icon: 'fa-codepen', name: 'codepen' }, { icon: 'fa-jsfiddle', name: 'jsfiddle' }, { icon: 'fa-life-bouy', name: 'life-bouy' }, { icon: 'fa-life-buoy', name: 'life-buoy' }, { icon: 'fa-life-saver', name: 'life-saver' }, { icon: 'fa-support', name: 'support' }, { icon: 'fa-life-ring', name: 'life-ring' }, { icon: 'fa-circle-o-notch', name: 'circle-o-notch' }, { icon: 'fa-ra', name: 'ra' }, { icon: 'fa-rebel', name: 'rebel' }, { icon: 'fa-ge', name: 'ge' }, { icon: 'fa-empire', name: 'empire' }, { icon: 'fa-git-square', name: 'git-square' }, { icon: 'fa-git', name: 'git' }, { icon: 'fa-hacker-news', name: 'hacker-news' }, { icon: 'fa-tencent-weibo', name: 'tencent-weibo' }, { icon: 'fa-qq', name: 'qq' }, { icon: 'fa-wechat', name: 'wechat' }, { icon: 'fa-weixin', name: 'weixin' }, { icon: 'fa-send', name: 'send' }, { icon: 'fa-paper-plane', name: 'paper-plane' }, { icon: 'fa-send-o', name: 'send-o' }, { icon: 'fa-paper-plane-o', name: 'paper-plane-o' }, { icon: 'fa-history', name: 'history' }, { icon: 'fa-genderless', name: 'genderless' }, { icon: 'fa-circle-thin', name: 'circle-thin' }, { icon: 'fa-header', name: 'header' }, { icon: 'fa-paragraph', name: 'paragraph' }, { icon: 'fa-sliders', name: 'sliders' }, { icon: 'fa-share-alt', name: 'share-alt' }, { icon: 'fa-share-alt-square', name: 'share-alt-square' }, { icon: 'fa-bomb', name: 'bomb' }, { icon: 'fa-soccer-ball-o', name: 'soccer-ball-o' }, { icon: 'fa-futbol-o', name: 'futbol-o' }, { icon: 'fa-tty', name: 'tty' }, { icon: 'fa-binoculars', name: 'binoculars' }, { icon: 'fa-plug', name: 'plug' }, { icon: 'fa-slideshare', name: 'slideshare' }, { icon: 'fa-twitch', name: 'twitch' }, { icon: 'fa-yelp', name: 'yelp' }, { icon: 'fa-newspaper-o', name: 'newspaper-o' }, { icon: 'fa-wifi', name: 'wifi' }, { icon: 'fa-calculator', name: 'calculator' }, { icon: 'fa-paypal', name: 'paypal' }, { icon: 'fa-google-wallet', name: 'google-wallet' }, { icon: 'fa-cc-visa', name: 'cc-visa' }, { icon: 'fa-cc-mastercard', name: 'cc-mastercard' }, { icon: 'fa-cc-discover', name: 'cc-discover' }, { icon: 'fa-cc-amex', name: 'cc-amex' }, { icon: 'fa-cc-paypal', name: 'cc-paypal' }, { icon: 'fa-cc-stripe', name: 'cc-stripe' }, { icon: 'fa-bell-slash', name: 'bell-slash' }, { icon: 'fa-bell-slash-o', name: 'bell-slash-o' }, { icon: 'fa-trash', name: 'trash' }, { icon: 'fa-copyright', name: 'copyright' }, { icon: 'fa-at', name: 'at' }, { icon: 'fa-eyedropper', name: 'eyedropper' }, { icon: 'fa-paint-brush', name: 'paint-brush' }, { icon: 'fa-birthday-cake', name: 'birthday-cake' }, { icon: 'fa-area-chart', name: 'area-chart' }, { icon: 'fa-pie-chart', name: 'pie-chart' }, { icon: 'fa-line-chart', name: 'line-chart' }, { icon: 'fa-lastfm', name: 'lastfm' }, { icon: 'fa-lastfm-square', name: 'lastfm-square' }, { icon: 'fa-toggle-off', name: 'toggle-off' }, { icon: 'fa-toggle-on', name: 'toggle-on' }, { icon: 'fa-bicycle', name: 'bicycle' }, { icon: 'fa-bus', name: 'bus' }, { icon: 'fa-ioxhost', name: 'ioxhost' }, { icon: 'fa-angellist', name: 'angellist' }, { icon: 'fa-cc', name: 'cc' }, { icon: 'fa-shekel', name: 'shekel' }, { icon: 'fa-sheqel', name: 'sheqel' }, { icon: 'fa-ils', name: 'ils' }, { icon: 'fa-meanpath', name: 'meanpath' }, { icon: 'fa-buysellads', name: 'buysellads' }, { icon: 'fa-connectdevelop', name: 'connectdevelop' }, { icon: 'fa-dashcube', name: 'dashcube' }, { icon: 'fa-forumbee', name: 'forumbee' }, { icon: 'fa-leanpub', name: 'leanpub' }, { icon: 'fa-sellsy', name: 'sellsy' }, { icon: 'fa-shirtsinbulk', name: 'shirtsinbulk' }, { icon: 'fa-simplybuilt', name: 'simplybuilt' }, { icon: 'fa-skyatlas', name: 'skyatlas' }, { icon: 'fa-cart-plus', name: 'cart-plus' }, { icon: 'fa-cart-arrow-down', name: 'cart-arrow-down' }, { icon: 'fa-diamond', name: 'diamond' }, { icon: 'fa-ship', name: 'ship' }, { icon: 'fa-user-secret', name: 'user-secret' }, { icon: 'fa-motorcycle', name: 'motorcycle' }, { icon: 'fa-street-view', name: 'street-view' }, { icon: 'fa-heartbeat', name: 'heartbeat' }, { icon: 'fa-venus', name: 'venus' }, { icon: 'fa-mars', name: 'mars' }, { icon: 'fa-mercury', name: 'mercury' }, { icon: 'fa-transgender', name: 'transgender' }, { icon: 'fa-transgender-alt', name: 'transgender-alt' }, { icon: 'fa-venus-double', name: 'venus-double' }, { icon: 'fa-mars-double', name: 'mars-double' }, { icon: 'fa-venus-mars', name: 'venus-mars' }, { icon: 'fa-mars-stroke', name: 'mars-stroke' }, { icon: 'fa-mars-stroke-v', name: 'mars-stroke-v' }, { icon: 'fa-mars-stroke-h', name: 'mars-stroke-h' }, { icon: 'fa-neuter', name: 'neuter' }, { icon: 'fa-facebook-official', name: 'facebook-official' }, { icon: 'fa-pinterest-p', name: 'pinterest-p' }, { icon: 'fa-whatsapp', name: 'whatsapp' }, { icon: 'fa-server', name: 'server' }, { icon: 'fa-user-plus', name: 'user-plus' }, { icon: 'fa-user-times', name: 'user-times' }, { icon: 'fa-hotel', name: 'hotel' }, { icon: 'fa-bed', name: 'bed' }, { icon: 'fa-viacoin', name: 'viacoin' }, { icon: 'fa-train', name: 'train' }, { icon: 'fa-subway', name: 'subway' }, { icon: 'fa-medium', name: 'medium' }]
});
// ===================
// Mobile
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  mobile: {

    init: function init() {
      app.setMobile();
    }
  },

  isMobile: function isMobile() {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return device;
  },

  setMobile: function setMobile() {
    var $body = $('body');

    $body.addClass('mobile');
  }

});
// ===================
// Helpers
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  listeners: {
    init: function init() {
      app.fixPath();
      app.readClient();
      app.setClient();
      app.isMobile();
      autosize(document.querySelectorAll('textarea'));

      $(window).resize(function () {
        app.windowWidth = $(window).width();
        app.setClient();
      });

      $(document).on('click', '.lists-container .list-item', function () {
        var $listItem = $('.list-item');

        $listItem.removeClass('active');
        $(this).addClass('active');
      });

      $(document).on('click', '.toggle-list-btn', function () {
        app.toggleLists();
      });

      $(document).on('click', '.active-progress', function () {
        $('.active-progress').toggleClass('show-details');
      });

      $(document).on('click', '.icon-container .list-icon', function () {
        $('.icon-dropdown').toggleClass('open');
      });

      $(document).on('click', '.icon-select .icon-option', function () {
        var icon = $(this).attr('data-icon'),
            $dropdown = $('.icon-dropdown'),
            $listItemIcon = app.getListItemIconById(app.activeListId);

        $dropdown.removeClass('open');
        app.updateListIcon(icon);
        $listItemIcon.addClass('bounce');
      });
    }
  },

  readClient: function readClient() {
    if (app.isMobile()) {
      app.mobileClient = true;
      app.mobile.init();
    } else {
      app.mobileClient = false;
    }

    if (app.windowWidth < 800 && app.windowWidth > 600) {
      app.tabletClient = true;
      app.desktopClient = false;
    } else if (app.windoWidth >= 800) {
      app.tabletClient = false;
      app.desktopClient = true;
    }
  },

  setClient: function setClient() {
    if (app.windowWidth > 600) {
      app.$notes.removeClass('expanded');
      app.$notes.removeClass('collapsed');
      app.$lists.removeClass('expanded');
      app.$lists.removeClass('collapsed');
      app.stopAnimation();
    } else {
      app.$notes.addClass('expanded');
      app.$lists.addClass('collapsed');
      app.animateContainers();
    }
  },

  toggleLists: function toggleLists() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { reset: false } : arguments[0];

    app.$lists.toggleClass('collapsed');
    app.$lists.toggleClass('expanded');
    app.$notes.toggleClass('expanded');
    app.$notes.toggleClass('collapsed');

    if (app.windowWidth < 600) {
      app.animateContainers();
    } else {
      app.stopAnimation();
    }
  },

  animateContainers: function animateContainers() {
    if (app.$lists.hasClass('collapsed') && app.$notes.hasClass('expanded')) {
      app.$lists.animate({ 'marginLeft': '-39%' }, 200);
      app.$notes.animate({ 'marginRight': '0%' }, 200);
    } else if (app.$lists.hasClass('expanded') && app.$notes.hasClass('collapsed')) {
      app.$notes.animate({ 'marginRight': '-45%' }, 200);
      app.$lists.animate({ 'marginLeft': '0%' }, 200);
    }
  },

  stopAnimation: function stopAnimation() {
    app.$notes.animate({ 'marginRight': '0%' }, 30);
    app.$lists.animate({ 'marginLeft': '0%' }, 30);
  },

  notify: function notify(notification) {
    var $loader = $('.kurt-loader .message');

    $loader.html(notification);
    $loader.removeClass('animated fadeOut');
    $loader.addClass('animated fadeIn');

    setTimeout(function () {
      $loader.removeClass('animated fadeIn');
      $loader.addClass('animated fadeOut');
    }, 1000);
  },

  fixPath: function fixPath() {
    if (window.location.hash && window.location.hash === "#_=_") {
      var _scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };

      window.location.hash = "";
      document.body.scrollTop = _scroll.top;
      document.body.scrollLeft = _scroll.left;
    }
  },

  animateListTotal: function animateListTotal(list) {
    var $length = $('div').find("[data-length='" + list._id + "']");

    $length.removeClass('fadeInUp');
    $length.text(list.length);
    $length.addClass('fadeOutUp');

    setTimeout(function () {
      $length.removeClass('fadeOutUp');
      $length.addClass('fadeInUp');
      $length.show();
    }, 300);
  },

  hasLengthChanged: function hasLengthChanged(list) {
    if (app.activeListLength === list.length) {
      return false;
    } else {
      app.activeListLength = list.length;
      app.animateListTotal(list);

      return true;
    }
  },

  greeting: function greeting() {
    var date = new Date(),
        time = date.getHours();

    switch (time) {
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return "Good Morning";
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        return "Good Afternoon";
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return "Good Evening";
    }
  }

});
'use strict';

RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate: _.template($('#input-template').html()),
  progressBarTemplate: _.template($('#progress-bar-template').html()),
  iconSelectTemplate: _.template($('#icon-select-template').html()),
  iconPlaceholderTemplate: _.template($('#icon-placeholder-template').html()),
  iconListItemTemplate: _.template($('#icon-list-item-template').html()),
  iconTemplate: _.template($('#icon-template').html()),
  registerTemplate: _.template($('#user-registration-template').html()),

  events: {
    'click .create-list-btn': 'createList',
    'click .create-note-btn': 'createNote',
    'keyup .note-input': 'createOnEnter',
    'keyup .activeInput': 'validate'
  },

  updateListIcon: function updateListIcon(icon) {
    var _id = app.activeListId,
        $listItemIcon = app.getListItemIconById(_id),
        notes = app.listsCollection.models,
        length = notes.length,
        attributes = { icon: icon, _id: _id, notes: notes },
        listModel = new RB.List(attributes);

    app.list.put(listModel, attributes);
    attributes.length = length;
    $listItemIcon.html(this.iconListItemTemplate(attributes));
  },

  createNote: function createNote() {
    var body = app.$noteInput.val(),
        list = app.$listInput.val(),
        done = false;

    if (body.trim() && list.trim() !== '') {
      var data = { body: body, list: list, done: done };

      if (app.listsCollection.length > 0) {
        for (var i = 0; i < app.listsCollection.length; i++) {
          var inMemory = app.listsCollection.models[i].body;

          if (data.body === inMemory) {
            return false;
          }
        }
      }
      app.post(data);
    }
  },

  createList: function createList() {
    var $barContainer = $('.active-progress'),
        $iconContainer = $('.input-container .icon-container');

    app.$noteInput.val('');
    app.$listInput.val('').focus();
    app.activeListId = null;
    app.$notesContainer.empty();
    $iconContainer.html(this.iconPlaceholderTemplate());
    $barContainer.empty();
    app.$notesContainer.attr('data-list', '');
  },

  createOnEnter: function createOnEnter(e) {
    if (e.keyCode === 13) {
      app.createNote();
    }
  },

  validate: function validate() {
    var body = app.$noteInput.val(),
        list = app.$listInput.val(),
        $check = $('.create-note-btn .fa');

    if (body.trim() && list.trim() !== '') {
      $check.addClass('ready');
    } else {
      $check.removeClass('ready');
    }
  },

  setLists: function setLists() {
    app.$listsContainer.empty();

    app.listsCollection.each(function (model) {
      var view = new RB.ListItem({ model: model });

      app.$listsContainer.append(view.render().el);
    });
  },

  setNote: function setNote(model) {
    var view = new RB.NoteItem({ model: model });

    app.$notesContainer.append(view.render().el);
  },

  setNotes: function setNotes(id) {
    var list = app.listsCollection.get(id),
        sorted = app.sortNotes(list.attributes.notes),
        notes = new RB.Notes(sorted),
        listname = list.attributes.name,
        $iconContainer = $('.input-container .icon-container'),
        icon = list.attributes.icon ? { icon: list.attributes.icon } : { icon: 'fa fa-tasks' };

    app.$notesContainer.empty();
    app.$listInput.val(listname);
    $iconContainer.empty();
    $iconContainer.append(app.iconTemplate(icon));

    notes.each(function (note) {
      var view = new RB.NoteItem({ model: note });

      app.$notesContainer.append(view.render().el);
    });

    if (app.activeListLength === null) {
      app.activeListLength = notes.length;
    }

    app.notesCollection = notes;
    app.resetActiveList(listname);
    app.renderActiveProgressBar(id);
  },

  sortNotes: function sortNotes(list) {
    var sorted = _.sortBy(list, 'done');

    return sorted;
  }

});
'use strict';

RB.ListItem = Backbone.View.extend({

  className: 'list-item',
  listTemplate: _.template($('#list-name-template').html()),

  events: {
    'click .inner-container': 'selected'
  },
  initialize: function initialize() {
    this.render();
  },

  render: function render() {
    this.$el.html(this.listTemplate(this.model.toJSON()));

    return this;
  },

  selected: function selected(e) {
    var listId = $(e.currentTarget).data('id'),
        $barContainer = $('.active-progress');

    $barContainer.empty();
    app.setNotes(listId);
    app.setActiveListId(listId);
  }
});
'use strict';

RB.NoteItem = Backbone.View.extend({

  className: 'note-item',
  itemTemplate: _.template($('#note-item-template').html()),
  attributes: {},

  initalize: function initalize() {
    this.listenTo(this.model, 'destroy', this.remove);
  },

  events: {
    'click .edit .fa-trash': 'destroyNote',
    'click .edit .fa-check-square': 'toggleDone',
    'click .note-text': 'positionCursor',
    'blur .note-text': 'updateNoteBody',
    'keyup .note-text': 'updateNoteOnEnter'
  },

  render: function render() {
    if (!this.model.get('timestamp') && this.model.get('created')) {
      var created = this.model.get('created');

      this.model.set('timestamp', this.convertDate(created));
    } else if (!this.model.get('timestamp') && !this.model.get('created')) {
      this.model.set('timestamp', this.convertDate(new Date()));
    }

    if (!this.model.get('done')) {
      this.model.set('done', false);
    }

    this.$el.html(this.itemTemplate(this.model.toJSON()));
    autosize($('textarea'));
    $('textarea').css({ 'resize': 'none' });

    return this;
  },

  positionCursor: function positionCursor(e) {
    var $input = $(e.currentTarget),
        range = $input.val().length;

    if (app.isMobile) {
      return false;
    } else if ($input.hasClass('busy')) {
      return false;
    } else {
      $input.addClass('busy');
      $input[0].setSelectionRange(range, range + 1);
    }
  },

  destroyNote: function destroyNote() {
    if (app.activeListLength === 1) {
      app.list.destroy(this.model, app.activeListId);

      return false;
    } else {
      app.destroy(this.model);
      this.remove();
    }
  },

  toggleDone: function toggleDone() {
    var isDone = this.model.get('done'),
        listId = this.getActiveListId(),
        attributes = {
      done: !isDone,
      listId: listId
    };

    app.put(this.model, attributes, this);
  },

  updateNoteBody: function updateNoteBody(e) {
    var $input = $(e.currentTarget),
        content = $input.val().trim(),
        listId = this.getActiveListId(),
        attributes = {
      body: content,
      listId: listId
    };

    $input.removeClass('busy');
    app.put(this.model, attributes, this);
  },

  updateNoteOnEnter: function updateNoteOnEnter(e) {
    var $input = $(e.currentTarget);

    if (e.keyCode === 13) {
      $input.blur();
    }
  }

});
"use strict";

var app = new RB.App();
app.start();