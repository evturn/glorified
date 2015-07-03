var express = require('express');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var NotesCtrl = require('../controllers/notes'),
    getNotes = NotesCtrl.getNotes,
    postNotes = NotesCtrl.postNotes,
    putNote = NotesCtrl.putNote,
    deleteNote = NotesCtrl.deleteNote;

var r = express.Router();

r.route('/')
  .get(ensureAuthenticated, getNotes)
  .post(ensureAuthenticated, urlencoded, postNotes);

r.route('/:id')
  .put(ensureAuthenticated, putNote)
  .delete(ensureAuthenticated, deleteNote);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.render('landing/index', {layout: 'landing'});
};

module.exports = r;