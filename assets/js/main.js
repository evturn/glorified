$(document).on('click', '.list-names-container .list-item', function() {
  $('.list-item').removeClass('active');
  $(this).addClass('active');
});