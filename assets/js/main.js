new WOW().init();
var wrapper = new Wrapper();

$(document).on('click', '.lists-container .list-item', function() {
  $('.list-item').removeClass('active');
  $(this).addClass('active');
});

$(document).on('click', '.toggle-list-btn.close-list', function() {
  var $lists = $('.lists-container .list-item');
  var $open = $('.toggle-list-btn.open-list');
  var $close = $('.toggle-list-btn.close-list');
  $close.addClass('hidden');
  $open.removeClass('hidden');
  $lists.slideToggle('fast');
});

$(document).on('click', '.toggle-list-btn.open-list', function() {
  var $lists = $('.lists-container .list-item');
  var $open = $('.toggle-list-btn.open-list');
  var $close = $('.toggle-list-btn.close-list');
  $close.removeClass('hidden');
  $open.addClass('hidden');
  $lists.slideToggle('fast');
});





var notify = function() {
  setTimeout(function(){
    $('.kurt-loader').fadeOut('fast', function() {
      $('.kurt-loader').empty();
      $('.kurt-loader').css({'display': 'block'});
    });
  }, 3000);
};

$(function() {
  $('[data-toggle="popover"]').popover({html: true});

  if (window.location.hash && window.location.hash === "#_=_") {


      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = "";

      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;

  }

});



