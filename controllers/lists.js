var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/User');
var List = require('../models/List');
var Note = require('../models/Note');

exports.getAll = function(req, res, next) {
  res.json(req.user.lists);
};

exports.post = function(req, res, next) {
  var user = req.user;
  var data = req.body;
  var lists = user.lists;
  var listsArray = user.lists.toObject();
  var counter = 0;
  var dateObject = new Date();
  var dateString = convertDate(dateObject);

  var newNote = new Note({
    list      : data.list,
    body      : data.body,
    done      : data.done,
    created   : dateObject,
    timestamp : dateString
  });

  for (var i = 0; i <= listsArray.length; i++) {
    counter += 1;
    var list = listsArray[i];

    if (list === undefined) {
      console.log('First list created: ' + data.list)
      var newList = new List({
        name: data.list
      });

      newList.notes.push(newNote);
      console.log('-------- ', newNote);
      user.lists.push(newList);
      var saved = saveUser(user, newNote);
      res.send(data);

      return false;
    }
    else if (list.name === data.list) {
      console.log(list.name + ' matches ' + data.list);
      var userList = user.lists.id(list._id);

      userList.notes.push(newNote);
      console.log('-------- ', newNote);
      var saved = saveUser(user, newNote);
      res.send(data);

      return false;
    }
    else if (list.name !== data.list && counter === listsArray.length) {
      console.log('New list created: ' + data.list);
      var newList = new List({
        name: data.list
      });

      newList.notes.push(newNote);
      console.log('-------- ', newNote);
      user.lists.push(newList);
      var saved = saveUser(user, newNote);
      res.send(data);

      return false;
    }

  }

};

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
  res.send(saved);
};

exports.delete = function(req, res, next) {
  var user = req.user;
  var listId = req.query.listId;
  var noteId = req.params.id;
  var list = user.lists.id(listId);
  var note = list.notes.id(noteId);

  console.log('--------list------ ', list);
  console.log('--------note------ ', note);

  var removed = note.remove();
  user.save(function(err, data) {
    if (err) {
      res.send(err);
    }
    else {
      console.log('----------Destroyed--------- ', data);
      res.json(removed);
    }
  });

};

var saveUser = function(user, note) {
  user.save(function(err, data) {
    if (err) {
      return console.log(err);
    }
    else {
      console.log('----------Saved--------- ', data);
      return note;
    }
  });
};

var convertDate = function convertDate(date) {
  var d = new Date(date);
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var min = minutes > 10 ? minutes : ('0' + minutes);
  var meridiem = hours >= 12 ? 'PM' : 'AM';
  var hour = hours > 12 ? hours - 12 : hours;
  month = ('' + (month + 1)).slice(-2);
  var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;

  return timestamp;
};
