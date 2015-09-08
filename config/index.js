module.exports = function() {

  var init = {};

  init.engine = function(handlebars) {
    var _engine = handlebars.create({
      layoutsDir: 'views/layouts',
      partialsDir: [
        'views/app',
        'views/partials',
        'views/landing'
      ],
      defaultLayout: 'app',
      helpers: new require('../views/helpers')(),
      extname: '.hbs'
    }).engine;

    return _engine;
  };

  init.views = {
    'views': 'views'
  };

  init.static = 'public/dist/';

  init.database = function(mongoose) {
    mongoose.connect('mongodb://localhost/ramenbuffet');
    mongoose.connection.on('error',
      console.error.bind(console,
        'connection error:'));
    mongoose.connection.once('open',
      function callback() {
        console.log('DB connected');
    });
  };

  init.session = {
    'secret'            : 'Quentin Vesclovious Cawks',
    'saveUninitialized' : false,
    'resave'            : false
  };

  return init;
};