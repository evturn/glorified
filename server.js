var express         = require('express'),
    methodOverride  = require('method-override'),
    _method         = require('./config/method-override'),
    path            = require('path'),
    connect         = require('connect'),
    logger          = require('morgan'),
    bodyParser      = require('body-parser'),
    cookieParser    = require('cookie-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    hbs = require('./config/handlebars'),
    root = __dirname + '/public';

var app = module.exports = express();

app.set('view engine', 'hbs');
app.set('views', 'views');
app.engine('hbs', hbs.engine);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(root));
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());

var http = require('./config/http');