let app = new RB.App();
app.start();

$(window).resize(function() {
  app.windowWidth = $(window).width();
  console.log(app.windowWidth);
  app.setClient();
});