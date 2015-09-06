var express         = require('express'),
    methodOverride  = require('method-override'),
    _method         = require('./config/method-override'),
    connect         = require('connect'),
    flash           = require('connect-flash');
    logger          = require('morgan'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    mongoose        = require('mongoose'),
    db              = require('./config/mongo')(mongoose),
    passport        = require('passport'),
    hbs             = require('./config/handlebars'),
    session         = require('express-session'),
    authRouter      = require('./routes/app'),
    notesRouter     = require('./routes/notes'),
    listsRouter     = require('./routes/lists'),
    usersRouter     = require('./routes/users'); // jshint ignore:line

var app = module.exports = express();

var id     = process.env.NODE_ENV === "development" ? process.env.FACEBOOK_ID_TEST : process.env.FACEBOOK_ID;
var secret = process.env.NODE_ENV === "development" ? process.env.FACEBOOK_SECRET_TEST : process.env.FACEBOOK_SECRET;

app.set('view engine', 'hbs');
app.set('views', 'views');
app.engine('hbs', hbs.engine);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(express.static(__dirname + '/dist'));
app.use(logger('dev'));
app.use(session({
  secret: 'dudeman jonesz',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);
app.use('/notes', notesRouter);
app.use('/users', usersRouter);
app.use('/lists', listsRouter);
app.use('/users', usersRouter);

var http = require('./config/http');