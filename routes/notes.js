var express = require('express');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var NotesCtrl = require('../controllers/notes'),
    getNotes = NotesCtrl.getNotes,
    postNotes = NotesCtrl.postNotes,
    putNote = NotesCtrl.putNote,
    deleteNote = NotesCtrl.deleteNote;

var listsCtrl = require('../controllers/lists');

var notes = express.Router();

notes.route('/')
  .get(ensureAuthenticated, listsCtrl.getAll)
  .post(ensureAuthenticated, urlencoded, listsCtrl.post);

notes.route('/:id')
  .put(ensureAuthenticated, listsCtrl.put)
  .delete(ensureAuthenticated, urlencoded, listsCtrl.delete);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('landing/index', {layout: 'landing'});
};

module.exports = notes;