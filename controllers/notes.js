var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/User');
var List = require('../models/List');
var Note = require('../models/Note');

exports.put = function(req, res, next) {
  var user = req.user;
  var data = req.body;
  var listId = data.listId;
  var noteId = data._id;
  var list = user.lists.id(listId);
  var note = list.notes.id(noteId);
  var updated = convertDate(Date.now());

  var updatedNote = note.set({
    "done"    : req.body.done,
    "body"    : req.body.body,
    "updated" : updated
  });

  var saved = saveUser(user, updatedNote);
  res.send(data);
};

exports.delete = function(req, res, next) {
  var user = req.user;
  var listId = req.query.listId;
  var noteId = req.params.id;
  var list = user.lists.id(listId);
  var note = list.notes.id(noteId);

  var removedNote = note.remove();

  if (list.notes.length === 0) {
    list.remove();
  }

  var saved = saveUser(user, removedNote);
  res.send(removedNote);
};

var saveUser = function(user, note) {
  user.save(function(err, data) {
    if (err) {
      console.log(err)
      return err;
    }
    else {
      console.log('----------Success---------');
      return note;
    }
  });
};

var convertDate = function(date) {
  var d         = new Date(date);
  var days      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  var year      = d.getFullYear();
  var _month    = d.getMonth();
  var month     = ('' + (_month + 1)).slice(-2);
  var day       = d.getDate();
  var hours     = d.getHours();
  var _minutes  = d.getMinutes();
  var minutes   = _minutes > 10 ? _minutes : ('0' + _minutes);
  var meridiem  = hours >= 12 ? 'pm' : 'am';
  var _hour     = hours > 12 ? hours - 12 : hours;
  var hour      = _hour === 0 ? 12 : _hour;
  var timestamp =  month + '/' + day + ' ' + hour + ':' + minutes + meridiem + ' ' + days[d.getDay()];

  return timestamp;
};