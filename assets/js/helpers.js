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

  get() {
    app.user.fetch({
      success(model, response) {
        app.listsCollection.stopListening();
        app.listsCollection = new RB.Lists(model.attributes.lists);
        app.setProgressBars();
      },
      error(err) {
        console.log(err);
      }
    });
  },

  setProgressBars() {
    let listData = [],
        i        = 0;

    app.listsCollection.each(function(list) {
      let _id            = list.id,
          name           = list.attributes.name,
          listCollection = new RB.Notes(list.attributes.notes),
          length         = listCollection.length,
          notDone        = listCollection.where({done: false}).length,
          done = length - notDone,
          notDonePct = ((notDone / length) * 100) + '%',
          donePct = ((done / length) * 100) + '%',
          data = {
            name,
            _id,
            length,
            notDone,
            notDonePct,
            done,
            donePct
          };

      listData.push(data);
      listCollection.stopListening();
      i++;
    });
    listData.forEach(function(list) {
      let $done = $('div').find("[data-done='" + list._id + "']"),
          $notDone = $('div').find("[data-notDone='" + list._id + "']");

      $done.css({'width': list.donePct});
      $notDone.css({'width': list.notDonePct});
    });

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
    }
  },

  convertDate(date) {
    let d = new Date(date),
        days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
        year = d.getFullYear(),
        month = d.getMonth(),
        day = d.getDate(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        min = minutes > 10 ? minutes : ('0' + minutes),
        meridiem = hours >= 12 ? 'PM' : 'AM',
        hour = hours > 12 ? hours - 12 : hours;

        month = ('' + (month + 1)).slice(-2);
    let timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;

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