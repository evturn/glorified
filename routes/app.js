var express = require('express');
var appCtrl = require('../controllers/app'),
    get = appCtrl.get;
var r = express.Router();

r.route('/')
  .get(get);

module.exports = r;