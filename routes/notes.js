var express = require('express');
var NotesCtrl = require('../controllers/notes'),
    getNotes = NotesCtrl.getNotes,
    postNotes = NotesCtrl.postNotes,
    deleteNote = NotesCtrl.deleteNote;

var r = express.Router();

r.route('/')
  .get(ensureAuthenticated, getNotes)
  .post(ensureAuthenticated, postNotes);

r.route('/:id')
  .delete(ensureAuthenticated, deleteNote);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.render('landing/index', {layout: 'landing'});
};

module.exports = r;