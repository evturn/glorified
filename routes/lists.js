var express = require('express');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var listsCtrl = require('../controllers/lists');

var lists = express.Router();

lists.route('/:id')
  .put(ensureAuthenticated, urlencoded, listsCtrl.putList)
  .delete(ensureAuthenticated, urlencoded, listsCtrl.deleteList);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('landing/index', {layout: 'landing'});
};

module.exports = lists;