RB.e = {

  init: function() {
    RB.e.setActiveList();
    RB.e.deviceEnv(800);
    RB.e.sunny();

    $(document).on('click', '.toggle-list-btn', function() {
      RB.e.toggleLists();
     });

    $(document).on('listSelected', function() {
      RB.e.garbageWatcher();
    });

    $(document).on('listChanged', function() {
      RB.e.listWatcher();
    });

  },

  deviceEnv: function(num) {

    if (RB.e.isMobile()) {
      setTimeout(RB.e.toggleLists, num);
    }

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

  garbageWatcher: function() {
    var activeList = document.getElementsByClassName('list-item active');
    var listname = $(activeList).prop('dataset').id;
    var number = RB.collection.where({list: listname, done: true}).length;

    RB.e.appendDoneStats(number);

  },

  appendDoneStats: function(number) {
    var $garbageContainer = $('.garbage-container');
    var $statContainer = $('.garbage-container .stat');
    var $trashContainer = $('.garbage-container .edit');
    var garbageTemplate = _.template($('#garbage-watcher-template').html());
    var sunnyTemplate = _.template($('#sunny-template').html());

    console.log(number);
    if (number !== 0) {
      $garbageContainer.html(garbageTemplate({length: number}));

    }
    else {
      $garbageContainer.html(sunnyTemplate());

    }
  },

  listWatcher: function() {
    var template = _.template($('#list-name-template').html());
    var $listsContainer = $('.lists-container');
    var activeList = document.getElementsByClassName('list-item active');
    var listname = $(activeList).prop('dataset').id;
    var number = RB.collection.where({list: listname, done: false}).length;

    $(activeList).remove();

    $listsContainer.append(template({
        name: listname,
        length: number}));

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

};