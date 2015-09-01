var handlebars = require('express-handlebars');
var helpers = require('./hbs-helpers');

var partials = [
  'views/app',
  'views/partials',
  'views/landing'
];

var hbs = handlebars.create({
  defaultLayout: 'app',
  extname: '.hbs',
  partialsDir: partials,
  layoutsDir: 'views/layouts',
  helpers: helpers
});

module.exports = hbs;