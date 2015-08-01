var express = require('express');
var mongoose = require('mongoose');
var Note = require('../models/note');
var User = require('../models/user');

exports.getNotes = function(req, res) {
  var notes = req.user.notes;
  res.json(notes);
};

exports.postNotes = function(req, res) {
  var currentUser = req.user;
  var note = new Note({
    position  : req.body.position,
    list      : req.body.list,
    body      : req.body.body,
    timestamp : req.body.timestamp,
    created   : req.body.created
  });
  currentUser.notes.push(note);
  currentUser.save(function(err) {
    if (err) {
      return console.log(err);
    }
    console.log('Data: ', note);
    res.send(note);
  });
};

exports.putNote = function(req, res) {
  var currentUser = req.user;
  var id = req.body._id;
  var note = currentUser.notes.id(id);

  var updated = note.set({"done": req.body.done});
  var updated = note.set({"body": req.body.body});

  currentUser.save(function(err) {
    if (err) {
      return res.send(err);
    }
    console.log(updated);
    console.log('Me saved it');
    res.json(updated);
  });
};

exports.deleteNote = function(req, res) {
  var user = req.user;
  var id = req.params.id;

  var note = user.notes.id(id).remove();
  user.save(function(err) {
    if (err) {
      res.send(err);
    }
    else {
      console.log('Me deleted it');
      res.json(note);
    }
  });

};