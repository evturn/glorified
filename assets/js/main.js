new WOW().init();

$(document).on('click', '.list-names-container .list-item', function() {
  $('.list-item').removeClass('active');
  $(this).addClass('active');
});

var notify = function() {
  setTimeout(function(){
    $('.kurt-loader').fadeOut('fast', function() {
      $('.kurt-loader').empty();
      $('.kurt-loader').css({'display': 'block'});
    });
  }, 1500);
};