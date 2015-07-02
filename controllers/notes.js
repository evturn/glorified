var express = require('express');
var mongoose = require('mongoose');
var Note = require('../models/note');
var User = require('../models/user');

exports.getNotes = function(req, res) {
  res.send({user: req.user});
};

exports.getLists = function(req, res) {
  var arr = [];
  var notes = req.user.notes;
  console.log(notes);
};

exports.postNotes = function(req, res) {
  var currentUser = req.user;
  var position = req.user.notes.length + 1;
  var note = new Note({
    position: position,
    list : req.body.category,
    body : req.body.body
  });
  currentUser.notes.push(note);
  currentUser.save(function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Me just saved: ', note);
    res.json(note);
  });
};


exports.deleteNote = function(req, res) {
  var user = req.user;
  var id = req.body.noteId;
  var note = user.note.id(id).remove();
  user.save(function(err) {
    if (err) {
      return res.send(err);
    }
    console.log('Me deleted it');
    res.redirect('/');
  });
  
};