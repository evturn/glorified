var express = require('express'),
    passport = require('passport');

var r = express();

r.get('/', function() {
  res.render('landing/index', {layout: 'laning'})
});