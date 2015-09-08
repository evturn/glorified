var handlebars = require('express-handlebars'),
    helpers    = new require('../views/helpers')();

var init = {};

init.session = {
    'secret'            : 'Quentin Vesclovious Cawks',
    'saveUninitialized' : false,
    'resave'            : false
};

init.engine = handlebars.create({
  layoutsDir: 'views/layouts',
  partialsDir: [
    'views/app',
    'views/partials',
    'views/landing'
  ],
  defaultLayout: 'app',
  helpers: helpers,
  extname: '.hbs'
}).engine;

init.views = 'views';
init.static = 'public/dist';
init.database = 'mongodb://localhost/ramenbuffet';


exports = module.exports = init;

exports.init = init;