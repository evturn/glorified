

function colorGenerator() {
  var colors = ['red', 'blue', 'green', 'yellow', 'purple', 'grey', 'black', 'orange', 'brown'];
  var color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

$('.landing-header').on('click', function() {
  $('.landing-header a').css('color', colorGenerator());
});

$(document).on('click', '.edit', function() {
  var input = $('.not-visible');
  console.log(input);
  input.removeClass('not-visible').addClass('visible');
  $(this).removeClass('visible').addClass('not-visible');
  input.focus();
});

var app = new App();