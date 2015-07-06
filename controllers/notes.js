var express = require('express');
var mongoose = require('mongoose');
var Note = require('../models/note');
var User = require('../models/user');

exports.getNotes = function(req, res) {
  var notes = req.user.notes;
  res.send(notes);
};

exports.postNotes = function(req, res) {
  var currentUser = req.user;
  var position = req.user.notes.length + 1;
  var note = new Note({
    position: position,
    list : req.body.list,
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

exports.putNote = function(req, res) {
  var currentUser = req.user;
  var id = req.body._id;
  var note = currentUser.notes.id(id);
  console.log('bod ', req.body);

  currentUser.notes.push(req.body);

  currentUser.save(function(err) {
    if (err) {
      return res.send(err);
    }
    console.log('Me updated ', note);
  });
  res.send('Note updated');
};

exports.deleteNote = function(req, res) {
  var user = req.user;
  var id = req.params.id;
  
  var note = user.notes.id(id).remove();
  user.save(function(err) {
    if (err) {
      return res.send(err);
    }
    console.log('Me deleted it');
    res.send('Note successfully deleted');
  });
  
};