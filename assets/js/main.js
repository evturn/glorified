new WOW().init();
var wrapper = new Wrapper();

$(document).on('click', '.lists-container .list-item', function() {
  $('.list-item').removeClass('active');
  $(this).addClass('active');
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



