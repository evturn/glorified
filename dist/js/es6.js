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
  idAttribute: '_id'
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
// ===================
// HTTP
// ===================

'use strict';

_.extend(Backbone.View.prototype, {

  start: function start() {
    app.renderForms();
    app.appendIcons();
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

        return app.listsCollection;
      },
      error: function error(err) {
        console.log(err);
      }
    });
  },

  get: function get() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? { render: true, _id: false } : arguments[0];

    app.user.fetch({
      success: function success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);

        if (options._id) {
          app.activeListId = options._id;
          app.setActiveListId(app.activeListId);
          app.setLists();
        } else if (options.render === false) {
          app.setLists();
          app.setProgressBars();

          return false;
        }
        app.setNotes(app.activeListId);
        app.setProgressBars();
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
        app.get({ _id: model._id, render: true });
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
    var id = model.get('_id'),
        listId = app.getActiveListId();

    model.set('listId', listId);

    if (id !== null) {
      model.destroy({
        url: '/notes/' + id + '?listId=' + listId,
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

    destroy: function destroy(model, id) {
      if (id !== null) {
        model.destroy({
          url: '/lists/' + id,
          success: function success(model, response) {
            console.log('success ', model);
            app.removeListItemById(id);
            app.notify('Removed');
            app.get({ render: false });
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
    app.$notesContainer.attr('data-list', id);
    app.activeListId = id;

    return this;
  },

  getListContainerById: function getListContainerById(id) {
    var $listItem = $('.list-item .inner-container');

    return $listItem.find("[data-id='" + id + "']");
  },

  removeListItemById: function removeListItemById(id) {
    var $container = app.getListContainerById(id);

    $container.parent().remove();
  },

  setListValue: function setListValue(listname) {
    app.$listInput.val(listname);
  },

  resetActiveList: function resetActiveList(listname) {
    var $listItem = $('.list-item'),
        $element = $('div').find("[data-id='" + listname + "']");

    $listItem.removeClass('active');
    $element.addClass('active');

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

  icons: [{ icon: 'fa-glass' }, { icon: 'fa-music' }, { icon: 'fa-search' }, { icon: 'fa-envelope-o' }, { icon: 'fa-heart' }, { icon: 'fa-star' }, { icon: 'fa-star-o' }, { icon: 'fa-user' }, { icon: 'fa-film' }, { icon: 'fa-th-large' }, { icon: 'fa-th' }, { icon: 'fa-th-list' }, { icon: 'fa-check' }, { icon: 'fa-remove' }, { icon: 'fa-close' }, { icon: 'fa-times' }, { icon: 'fa-search-plus' }, { icon: 'fa-search-minus' }, { icon: 'fa-power-off' }, { icon: 'fa-signal' }, { icon: 'fa-gear' }, { icon: 'fa-cog' }, { icon: 'fa-trash-o' }, { icon: 'fa-home' }, { icon: 'fa-file-o' }, { icon: 'fa-clock-o' }, { icon: 'fa-road' }, { icon: 'fa-download' }, { icon: 'fa-arrow-circle-o-down' }, { icon: 'fa-arrow-circle-o-up' }, { icon: 'fa-inbox' }, { icon: 'fa-play-circle-o' }, { icon: 'fa-rotate-right' }, { icon: 'fa-repeat' }, { icon: 'fa-refresh' }, { icon: 'fa-list-alt' }, { icon: 'fa-lock' }, { icon: 'fa-flag' }, { icon: 'fa-headphones' }, { icon: 'fa-volume-off' }, { icon: 'fa-volume-down' }, { icon: 'fa-volume-up' }, { icon: 'fa-qrcode' }, { icon: 'fa-barcode' }, { icon: 'fa-tag' }, { icon: 'fa-tags' }, { icon: 'fa-book' }, { icon: 'fa-bookmark' }, { icon: 'fa-print' }, { icon: 'fa-camera' }, { icon: 'fa-font' }, { icon: 'fa-bold' }, { icon: 'fa-italic' }, { icon: 'fa-text-height' }, { icon: 'fa-text-width' }, { icon: 'fa-align-left' }, { icon: 'fa-align-center' }, { icon: 'fa-align-right' }, { icon: 'fa-align-justify' }, { icon: 'fa-list' }, { icon: 'fa-dedent' }, { icon: 'fa-outdent' }, { icon: 'fa-indent' }, { icon: 'fa-video-camera' }, { icon: 'fa-photo' }, { icon: 'fa-image' }, { icon: 'fa-picture-o' }, { icon: 'fa-pencil' }, { icon: 'fa-map-marker' }, { icon: 'fa-adjust' }, { icon: 'fa-tint' }, { icon: 'fa-edit' }, { icon: 'fa-pencil-square-o' }, { icon: 'fa-share-square-o' }, { icon: 'fa-check-square-o' }, { icon: 'fa-arrows' }, { icon: 'fa-step-backward' }, { icon: 'fa-fast-backward' }, { icon: 'fa-backward' }, { icon: 'fa-play' }, { icon: 'fa-pause' }, { icon: 'fa-stop' }, { icon: 'fa-forward' }, { icon: 'fa-fast-forward' }, { icon: 'fa-step-forward' }, { icon: 'fa-eject' }, { icon: 'fa-chevron-left' }, { icon: 'fa-chevron-right' }, { icon: 'fa-plus-circle' }, { icon: 'fa-minus-circle' }, { icon: 'fa-times-circle' }, { icon: 'fa-check-circle' }, { icon: 'fa-question-circle' }, { icon: 'fa-info-circle' }, { icon: 'fa-crosshairs' }, { icon: 'fa-times-circle-o' }, { icon: 'fa-check-circle-o' }, { icon: 'fa-ban' }, { icon: 'fa-arrow-left' }, { icon: 'fa-arrow-right' }, { icon: 'fa-arrow-up' }, { icon: 'fa-arrow-down' }, { icon: 'fa-mail-forward' }, { icon: 'fa-share' }, { icon: 'fa-expand' }, { icon: 'fa-compress' }, { icon: 'fa-plus' }, { icon: 'fa-minus' }, { icon: 'fa-asterisk' }, { icon: 'fa-exclamation-circle' }, { icon: 'fa-gift' }, { icon: 'fa-leaf' }, { icon: 'fa-fire' }, { icon: 'fa-eye' }, { icon: 'fa-eye-slash' }, { icon: 'fa-warning' }, { icon: 'fa-exclamation-triangle' }, { icon: 'fa-plane' }, { icon: 'fa-calendar' }, { icon: 'fa-random' }, { icon: 'fa-comment' }, { icon: 'fa-magnet' }, { icon: 'fa-chevron-up' }, { icon: 'fa-chevron-down' }, { icon: 'fa-retweet' }, { icon: 'fa-shopping-cart' }, { icon: 'fa-folder' }, { icon: 'fa-folder-open' }, { icon: 'fa-arrows-v' }, { icon: 'fa-arrows-h' }, { icon: 'fa-bar-chart-o' }, { icon: 'fa-bar-chart' }, { icon: 'fa-twitter-square' }, { icon: 'fa-facebook-square' }, { icon: 'fa-camera-retro' }, { icon: 'fa-key' }, { icon: 'fa-gears' }, { icon: 'fa-cogs' }, { icon: 'fa-comments' }, { icon: 'fa-thumbs-o-up' }, { icon: 'fa-thumbs-o-down' }, { icon: 'fa-star-half' }, { icon: 'fa-heart-o' }, { icon: 'fa-sign-out' }, { icon: 'fa-linkedin-square' }, { icon: 'fa-thumb-tack' }, { icon: 'fa-external-link' }, { icon: 'fa-sign-in' }, { icon: 'fa-trophy' }, { icon: 'fa-github-square' }, { icon: 'fa-upload' }, { icon: 'fa-lemon-o' }, { icon: 'fa-phone' }, { icon: 'fa-square-o' }, { icon: 'fa-bookmark-o' }, { icon: 'fa-phone-square' }, { icon: 'fa-twitter' }, { icon: 'fa-facebook-f' }, { icon: 'fa-facebook' }, { icon: 'fa-github' }, { icon: 'fa-unlock' }, { icon: 'fa-credit-card' }, { icon: 'fa-rss' }, { icon: 'fa-hdd-o' }, { icon: 'fa-bullhorn' }, { icon: 'fa-bell' }, { icon: 'fa-certificate' }, { icon: 'fa-hand-o-right' }, { icon: 'fa-hand-o-left' }, { icon: 'fa-hand-o-up' }, { icon: 'fa-hand-o-down' }, { icon: 'fa-arrow-circle-left' }, { icon: 'fa-arrow-circle-right' }, { icon: 'fa-arrow-circle-up' }, { icon: 'fa-arrow-circle-down' }, { icon: 'fa-globe' }, { icon: 'fa-wrench' }, { icon: 'fa-tasks' }, { icon: 'fa-filter' }, { icon: 'fa-briefcase' }, { icon: 'fa-arrows-alt' }, { icon: 'fa-group' }, { icon: 'fa-users' }, { icon: 'fa-chain' }, { icon: 'fa-link' }, { icon: 'fa-cloud' }, { icon: 'fa-flask' }, { icon: 'fa-cut' }, { icon: 'fa-scissors' }, { icon: 'fa-copy' }, { icon: 'fa-files-o' }, { icon: 'fa-paperclip' }, { icon: 'fa-save' }, { icon: 'fa-floppy-o' }, { icon: 'fa-square' }, { icon: 'fa-navicon' }, { icon: 'fa-reorder' }, { icon: 'fa-bars' }, { icon: 'fa-list-ul' }, { icon: 'fa-list-ol' }, { icon: 'fa-strikethrough' }, { icon: 'fa-underline' }, { icon: 'fa-table' }, { icon: 'fa-magic' }, { icon: 'fa-truck' }, { icon: 'fa-pinterest' }, { icon: 'fa-pinterest-square' }, { icon: 'fa-google-plus-square' }, { icon: 'fa-google-plus' }, { icon: 'fa-money' }, { icon: 'fa-caret-down' }, { icon: 'fa-caret-up' }, { icon: 'fa-caret-left' }, { icon: 'fa-caret-right' }, { icon: 'fa-columns' }, { icon: 'fa-unsorted' }, { icon: 'fa-sort' }, { icon: 'fa-sort-down' }, { icon: 'fa-sort-desc' }, { icon: 'fa-sort-up' }, { icon: 'fa-sort-asc' }, { icon: 'fa-envelope' }, { icon: 'fa-linkedin' }, { icon: 'fa-rotate-left' }, { icon: 'fa-undo' }, { icon: 'fa-legal' }, { icon: 'fa-gavel' }, { icon: 'fa-dashboard' }, { icon: 'fa-tachometer' }, { icon: 'fa-comment-o' }, { icon: 'fa-comments-o' }, { icon: 'fa-flash' }, { icon: 'fa-bolt' }, { icon: 'fa-sitemap' }, { icon: 'fa-umbrella' }, { icon: 'fa-paste' }, { icon: 'fa-clipboard' }, { icon: 'fa-lightbulb-o' }, { icon: 'fa-exchange' }, { icon: 'fa-cloud-download' }, { icon: 'fa-cloud-upload' }, { icon: 'fa-user-md' }, { icon: 'fa-stethoscope' }, { icon: 'fa-suitcase' }, { icon: 'fa-bell-o' }, { icon: 'fa-coffee' }, { icon: 'fa-cutlery' }, { icon: 'fa-file-text-o' }, { icon: 'fa-building-o' }, { icon: 'fa-hospital-o' }, { icon: 'fa-ambulance' }, { icon: 'fa-medkit' }, { icon: 'fa-fighter-jet' }, { icon: 'fa-beer' }, { icon: 'fa-h-square' }, { icon: 'fa-plus-square' }, { icon: 'fa-angle-double-left' }, { icon: 'fa-angle-double-right' }, { icon: 'fa-angle-double-up' }, { icon: 'fa-angle-double-down' }, { icon: 'fa-angle-left' }, { icon: 'fa-angle-right' }, { icon: 'fa-angle-up' }, { icon: 'fa-angle-down' }, { icon: 'fa-desktop' }, { icon: 'fa-laptop' }, { icon: 'fa-tablet' }, { icon: 'fa-mobile-phone' }, { icon: 'fa-mobile' }, { icon: 'fa-circle-o' }, { icon: 'fa-quote-left' }, { icon: 'fa-quote-right' }, { icon: 'fa-spinner' }, { icon: 'fa-circle' }, { icon: 'fa-mail-reply' }, { icon: 'fa-reply' }, { icon: 'fa-github-alt' }, { icon: 'fa-folder-o' }, { icon: 'fa-folder-open-o' }, { icon: 'fa-smile-o' }, { icon: 'fa-frown-o' }, { icon: 'fa-meh-o' }, { icon: 'fa-gamepad' }, { icon: 'fa-keyboard-o' }, { icon: 'fa-flag-o' }, { icon: 'fa-flag-checkered' }, { icon: 'fa-terminal' }, { icon: 'fa-code' }, { icon: 'fa-mail-reply-all' }, { icon: 'fa-reply-all' }, { icon: 'fa-star-half-empty' }, { icon: 'fa-star-half-full' }, { icon: 'fa-star-half-o' }, { icon: 'fa-location-arrow' }, { icon: 'fa-crop' }, { icon: 'fa-code-fork' }, { icon: 'fa-unlink' }, { icon: 'fa-chain-broken' }, { icon: 'fa-question' }, { icon: 'fa-info' }, { icon: 'fa-exclamation' }, { icon: 'fa-superscript' }, { icon: 'fa-subscript' }, { icon: 'fa-eraser' }, { icon: 'fa-puzzle-piece' }, { icon: 'fa-microphone' }, { icon: 'fa-microphone-slash' }, { icon: 'fa-shield' }, { icon: 'fa-calendar-o' }, { icon: 'fa-fire-extinguisher' }, { icon: 'fa-rocket' }, { icon: 'fa-maxcdn' }, { icon: 'fa-chevron-circle-left' }, { icon: 'fa-chevron-circle-right' }, { icon: 'fa-chevron-circle-up' }, { icon: 'fa-chevron-circle-down' }, { icon: 'fa-html5' }, { icon: 'fa-css3' }, { icon: 'fa-anchor' }, { icon: 'fa-unlock-alt' }, { icon: 'fa-bullseye' }, { icon: 'fa-ellipsis-h' }, { icon: 'fa-ellipsis-v' }, { icon: 'fa-rss-square' }, { icon: 'fa-play-circle' }, { icon: 'fa-ticket' }, { icon: 'fa-minus-square' }, { icon: 'fa-minus-square-o' }, { icon: 'fa-level-up' }, { icon: 'fa-level-down' }, { icon: 'fa-check-square' }, { icon: 'fa-pencil-square' }, { icon: 'fa-external-link-square' }, { icon: 'fa-share-square' }, { icon: 'fa-compass' }, { icon: 'fa-toggle-down' }, { icon: 'fa-caret-square-o-down' }, { icon: 'fa-toggle-up' }, { icon: 'fa-caret-square-o-up' }, { icon: 'fa-toggle-right' }, { icon: 'fa-caret-square-o-right' }, { icon: 'fa-euro' }, { icon: 'fa-eur' }, { icon: 'fa-gbp' }, { icon: 'fa-dollar' }, { icon: 'fa-usd' }, { icon: 'fa-rupee' }, { icon: 'fa-inr' }, { icon: 'fa-cny' }, { icon: 'fa-rmb' }, { icon: 'fa-yen' }, { icon: 'fa-jpy' }, { icon: 'fa-ruble' }, { icon: 'fa-rouble' }, { icon: 'fa-rub' }, { icon: 'fa-won' }, { icon: 'fa-krw' }, { icon: 'fa-bitcoin' }, { icon: 'fa-btc' }, { icon: 'fa-file' }, { icon: 'fa-file-text' }, { icon: 'fa-sort-alpha-asc' }, { icon: 'fa-sort-alpha-desc' }, { icon: 'fa-sort-amount-asc' }, { icon: 'fa-sort-amount-desc' }, { icon: 'fa-sort-numeric-asc' }, { icon: 'fa-sort-numeric-desc' }, { icon: 'fa-thumbs-up' }, { icon: 'fa-thumbs-down' }, { icon: 'fa-youtube-square' }, { icon: 'fa-youtube' }, { icon: 'fa-xing' }, { icon: 'fa-xing-square' }, { icon: 'fa-youtube-play' }, { icon: 'fa-dropbox' }, { icon: 'fa-stack-overflow' }, { icon: 'fa-instagram' }, { icon: 'fa-flickr' }, { icon: 'fa-adn' }, { icon: 'fa-bitbucket' }, { icon: 'fa-bitbucket-square' }, { icon: 'fa-tumblr' }, { icon: 'fa-tumblr-square' }, { icon: 'fa-long-arrow-down' }, { icon: 'fa-long-arrow-up' }, { icon: 'fa-long-arrow-left' }, { icon: 'fa-long-arrow-right' }, { icon: 'fa-apple' }, { icon: 'fa-windows' }, { icon: 'fa-android' }, { icon: 'fa-linux' }, { icon: 'fa-dribbble' }, { icon: 'fa-skype' }, { icon: 'fa-foursquare' }, { icon: 'fa-trello' }, { icon: 'fa-female' }, { icon: 'fa-male' }, { icon: 'fa-gittip' }, { icon: 'fa-gratipay' }, { icon: 'fa-sun-o' }, { icon: 'fa-moon-o' }, { icon: 'fa-archive' }, { icon: 'fa-bug' }, { icon: 'fa-vk' }, { icon: 'fa-weibo' }, { icon: 'fa-renren' }, { icon: 'fa-pagelines' }, { icon: 'fa-stack-exchange' }, { icon: 'fa-arrow-circle-o-right' }, { icon: 'fa-arrow-circle-o-left' }, { icon: 'fa-toggle-left' }, { icon: 'fa-caret-square-o-left' }, { icon: 'fa-dot-circle-o' }, { icon: 'fa-wheelchair' }, { icon: 'fa-vimeo-square' }, { icon: 'fa-turkish-lira' }, { icon: 'fa-try' }, { icon: 'fa-plus-square-o' }, { icon: 'fa-space-shuttle' }, { icon: 'fa-slack' }, { icon: 'fa-envelope-square' }, { icon: 'fa-wordpress' }, { icon: 'fa-openid' }, { icon: 'fa-institution' }, { icon: 'fa-bank' }, { icon: 'fa-university' }, { icon: 'fa-mortar-board' }, { icon: 'fa-graduation-cap' }, { icon: 'fa-yahoo' }, { icon: 'fa-google' }, { icon: 'fa-reddit' }, { icon: 'fa-reddit-square' }, { icon: 'fa-stumbleupon-circle' }, { icon: 'fa-stumbleupon' }, { icon: 'fa-delicious' }, { icon: 'fa-digg' }, { icon: 'fa-pied-piper' }, { icon: 'fa-pied-piper-alt' }, { icon: 'fa-drupal' }, { icon: 'fa-joomla' }, { icon: 'fa-language' }, { icon: 'fa-fax' }, { icon: 'fa-building' }, { icon: 'fa-child' }, { icon: 'fa-paw' }, { icon: 'fa-spoon' }, { icon: 'fa-cube' }, { icon: 'fa-cubes' }, { icon: 'fa-behance' }, { icon: 'fa-behance-square' }, { icon: 'fa-steam' }, { icon: 'fa-steam-square' }, { icon: 'fa-recycle' }, { icon: 'fa-automobile' }, { icon: 'fa-car' }, { icon: 'fa-cab' }, { icon: 'fa-taxi' }, { icon: 'fa-tree' }, { icon: 'fa-spotify' }, { icon: 'fa-deviantart' }, { icon: 'fa-soundcloud' }, { icon: 'fa-database' }, { icon: 'fa-file-pdf-o' }, { icon: 'fa-file-word-o' }, { icon: 'fa-file-excel-o' }, { icon: 'fa-file-powerpoint-o' }, { icon: 'fa-file-photo-o' }, { icon: 'fa-file-picture-o' }, { icon: 'fa-file-image-o' }, { icon: 'fa-file-zip-o' }, { icon: 'fa-file-archive-o' }, { icon: 'fa-file-sound-o' }, { icon: 'fa-file-audio-o' }, { icon: 'fa-file-movie-o' }, { icon: 'fa-file-video-o' }, { icon: 'fa-file-code-o' }, { icon: 'fa-vine' }, { icon: 'fa-codepen' }, { icon: 'fa-jsfiddle' }, { icon: 'fa-life-bouy' }, { icon: 'fa-life-buoy' }, { icon: 'fa-life-saver' }, { icon: 'fa-support' }, { icon: 'fa-life-ring' }, { icon: 'fa-circle-o-notch' }, { icon: 'fa-ra' }, { icon: 'fa-rebel' }, { icon: 'fa-ge' }, { icon: 'fa-empire' }, { icon: 'fa-git-square' }, { icon: 'fa-git' }, { icon: 'fa-hacker-news' }, { icon: 'fa-tencent-weibo' }, { icon: 'fa-qq' }, { icon: 'fa-wechat' }, { icon: 'fa-weixin' }, { icon: 'fa-send' }, { icon: 'fa-paper-plane' }, { icon: 'fa-send-o' }, { icon: 'fa-paper-plane-o' }, { icon: 'fa-history' }, { icon: 'fa-genderless' }, { icon: 'fa-circle-thin' }, { icon: 'fa-header' }, { icon: 'fa-paragraph' }, { icon: 'fa-sliders' }, { icon: 'fa-share-alt' }, { icon: 'fa-share-alt-square' }, { icon: 'fa-bomb' }, { icon: 'fa-soccer-ball-o' }, { icon: 'fa-futbol-o' }, { icon: 'fa-tty' }, { icon: 'fa-binoculars' }, { icon: 'fa-plug' }, { icon: 'fa-slideshare' }, { icon: 'fa-twitch' }, { icon: 'fa-yelp' }, { icon: 'fa-newspaper-o' }, { icon: 'fa-wifi' }, { icon: 'fa-calculator' }, { icon: 'fa-paypal' }, { icon: 'fa-google-wallet' }, { icon: 'fa-cc-visa' }, { icon: 'fa-cc-mastercard' }, { icon: 'fa-cc-discover' }, { icon: 'fa-cc-amex' }, { icon: 'fa-cc-paypal' }, { icon: 'fa-cc-stripe' }, { icon: 'fa-bell-slash' }, { icon: 'fa-bell-slash-o' }, { icon: 'fa-trash' }, { icon: 'fa-copyright' }, { icon: 'fa-at' }, { icon: 'fa-eyedropper' }, { icon: 'fa-paint-brush' }, { icon: 'fa-birthday-cake' }, { icon: 'fa-area-chart' }, { icon: 'fa-pie-chart' }, { icon: 'fa-line-chart' }, { icon: 'fa-lastfm' }, { icon: 'fa-lastfm-square' }, { icon: 'fa-toggle-off' }, { icon: 'fa-toggle-on' }, { icon: 'fa-bicycle' }, { icon: 'fa-bus' }, { icon: 'fa-ioxhost' }, { icon: 'fa-angellist' }, { icon: 'fa-cc' }, { icon: 'fa-shekel' }, { icon: 'fa-sheqel' }, { icon: 'fa-ils' }, { icon: 'fa-meanpath' }, { icon: 'fa-buysellads' }, { icon: 'fa-connectdevelop' }, { icon: 'fa-dashcube' }, { icon: 'fa-forumbee' }, { icon: 'fa-leanpub' }, { icon: 'fa-sellsy' }, { icon: 'fa-shirtsinbulk' }, { icon: 'fa-simplybuilt' }, { icon: 'fa-skyatlas' }, { icon: 'fa-cart-plus' }, { icon: 'fa-cart-arrow-down' }, { icon: 'fa-diamond' }, { icon: 'fa-ship' }, { icon: 'fa-user-secret' }, { icon: 'fa-motorcycle' }, { icon: 'fa-street-view' }, { icon: 'fa-heartbeat' }, { icon: 'fa-venus' }, { icon: 'fa-mars' }, { icon: 'fa-mercury' }, { icon: 'fa-transgender' }, { icon: 'fa-transgender-alt' }, { icon: 'fa-venus-double' }, { icon: 'fa-mars-double' }, { icon: 'fa-venus-mars' }, { icon: 'fa-mars-stroke' }, { icon: 'fa-mars-stroke-v' }, { icon: 'fa-mars-stroke-h' }, { icon: 'fa-neuter' }, { icon: 'fa-facebook-official' }, { icon: 'fa-pinterest-p' }, { icon: 'fa-whatsapp' }, { icon: 'fa-server' }, { icon: 'fa-user-plus' }, { icon: 'fa-user-times' }, { icon: 'fa-hotel' }, { icon: 'fa-bed' }, { icon: 'fa-viacoin' }, { icon: 'fa-train' }, { icon: 'fa-subway' }, { icon: 'fa-medium' }]
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
      app.$lists.animate({ 'marginLeft': '-42%' }, 200);
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
  }
});
'use strict';

RB.App = Backbone.View.extend({

  el: '.dmc',

  inputTemplate: _.template($('#input-template').html()),
  progressBarTemplate: _.template($('#progress-bar-template').html()),
  iconSelectTemplate: _.template($('#icon-select-template').html()),
  iconTemplate: _.template($('#icon-template').html()),

  events: {
    'click .create-list-btn': 'createList',
    'click .create-note-btn': 'createNote',
    'keyup .note-input': 'createOnEnter',
    'keyup .activeInput': 'validate'
  },

  createNote: function createNote() {
    var body = app.$noteInput.val(),
        list = app.$listInput.val(),
        done = false;

    if (body.trim() && list.trim() !== '') {
      var note = { body: body, list: list, done: done };

      if (app.listsCollection.length > 0) {
        for (var i = 0; i < app.listsCollection.length; i++) {
          var inMemory = app.listsCollection.models[i].body;
          if (note.body === inMemory) {
            return false;
          }
        }
      }

      app.post(note);
    }

    return this;
  },

  createList: function createList() {
    var $barContainer = $('.active-progress');

    app.$noteInput.val('');
    app.$listInput.val('').focus();
    app.activeListId = null;
    app.$notesContainer.empty();
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
        $listIcon = $('.list-icon'),
        icon = list.attributes.icon ? { icon: list.attributes.icon } : { icon: 'fa fa-list' };

    app.$notesContainer.empty();
    app.$listInput.val(listname);
    $listIcon.empty();
    $listIcon.append(app.iconTemplate(icon));

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