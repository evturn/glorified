var express          = require('express'),
    app              = express(),
    init             = require('./config/index'),
    connect          = require('connect'),
    flash            = require('connect-flash'),
    bodyParser       = require('body-parser'),
    urlencoded       = bodyParser.urlencoded({extended: false}),
    cookieParser     = require('cookie-parser'),
    session          = require('express-session'),
    logger           = require('morgan')('dev'),
    mongoose         = require('mongoose'),
    passport         = require('passport'),
    notes            = require('./routes/notes'),
    lists            = require('./routes/lists'),
    users            = require('./routes/users');
    oauth            = require('./routes/users');
    User             = require('./models/User');

app.set('view engine', 'hbs');
app.set(init.views);
app.engine('hbs', init.engine);

app.use(express.static(init.static));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(urlencoded);
app.use(logger);
app.use(session(init.session));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', oauth);
app.use('/notes', notes);
app.use('/lists', lists);
app.use('/users', users);

app.listen(3000);