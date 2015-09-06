var express = require('express');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var listsCtrl = require('../controllers/lists');
var notesCtrl = require('../controllers/notes');

var notes = express.Router();

notes.route('/')
  .get(ensureAuthenticated, listsCtrl.getAll)
  .post(ensureAuthenticated, urlencoded, listsCtrl.post);

notes.route('/:id')
  .put(ensureAuthenticated, notesCtrl.put)
  .delete(ensureAuthenticated, urlencoded, notesCtrl.delete);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('landing/index', {layout: 'landing'});
}

module.exports = notes;