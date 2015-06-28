var express         = require('express'),
    methodOverride  = require('method-override'),
    _method         = require('./config/method-override'),
    path            = require('path'),
    connect         = require('connect'),
    logger          = require('morgan'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    mongoose        = require('mongoose'),
    db              = require('./config/mongo')(mongoose),
    passport        = require('passport'),
    FacebookStrategy = require('passport-facebook'),
    hbs             = require('./config/handlebars'),
    authRouter      = require('./routes/app');
    notesRouter     = require('./routes/notes');
    root            = __dirname + '/dist';

var app = module.exports = express();

app.set('view engine', 'hbs');
app.set('views', 'views');
app.engine('hbs', hbs.engine);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(root));
app.use(logger('dev'));
app.use(require('express-session')({
  secret: 'dudeman jones',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);
app.use('/notes', notesRouter);

var http = require('./config/http');