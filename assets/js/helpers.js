_.extend(Backbone.View.prototype, {

  notify: function(notification) {
    var $loader = $('.kurt-loader');
    $loader.html('<p class="thin-sm animated fadeIn">' + notification + '</p>');
    var $text = $loader.find('.thin-sm');

    setTimeout(function() {
      $text.removeClass('animated fadeIn');
      $text.addClass('animated fadeOut');
    }, 1000);

  },

// ===================
// Type Conversion Helpers
// ===================

  tojquery: function(element) {

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
    }

  },

  convertDate: function(date) {
    var d = new Date(date);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var min = minutes > 10 ? minutes : ('0' + minutes);
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    var hour = hours > 12 ? hours - 12 : hours;
    month = ('' + (month + 1)).slice(-2);
    var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;

    return timestamp;
  },

// ===================
// DOM & Device Helpers
// ===================

  deviceEnv: function(num) {
    if (this.isMobile()) {
      setTimeout(this.toggleLists, num);
    }

  },

  setFirstChildActive: function() {
    var listItem = $('.lists-container').first();

    listItem.addClass('active');
  },

  setActiveList: function() {
    $(document).on('click', '.lists-container .list-item', function() {
      var $listItem = $('.list-item');

      $listItem.removeClass('active');
      $(this).addClass('active');
      $(document).trigger('listSelected');
    });
  },

  toggleLists: function() {
    var $listsContainer = $('.lists-container');
    var $icon = $('.toggle-list-btn .fa');

    $listsContainer.slideToggle('fast');
    $icon.toggleClass('collapsed');
  },

  isMobile: function() {
    var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return device;
  },

  onChangeListeners: function() {
    var numberDone = this.garbageWatcher();
    this.appendDoneStats(numberDone);
  },

  garbageWatcher() {
    var number = app.listsCollection.length;
    console.log(number);

    return number;
  },

  appendDoneStats: function(number) {
    var $garbageContainer = $('.garbage-container');
    var $statContainer = $('.garbage-container .stat');
    var $trashContainer = $('.garbage-container .edit');

    if (number !== 0) {
      $garbageContainer.html(this.garbageTemplate({length: number}));

    }
    else {
      $garbageContainer.html(this.allDoneTemplate());

    }

    return this;
  },

  sunny: function() {
    var counter = 0;

    setInterval(function() {
      $('.fa.fa-certificate').css({'-ms-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-moz-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-o-transform': 'rotate(' + counter + 'deg)'})
                       .css({'-webkit-transform': 'rotate(' + counter + 'deg)'})
                       .css({'transform': 'rotate(' + counter + 'deg)'});
      counter += 3;

    }, 100);
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

  },

});