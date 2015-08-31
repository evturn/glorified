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
        name: data.list,
        icon: data.icon
      });

      newList.notes.push(newNote);
      console.log('-------- ', newNote);
      user.lists.push(newList);
      var saved = saveUser(user, newNote);
      res.send(newList);

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
        name: data.list,
        icon: data.icon
      });

      newList.notes.push(newNote);
      console.log('-------- ', newNote);
      user.lists.push(newList);
      var saved = saveUser(user, newNote);
      res.send(newList);

      return false;
    }

  }

};

exports.putList = function(req, res, next) {
  var user = req.user;
  var listId = req.body._id;
  var icon = req.body.icon;
  var list = user.lists.id(listId);

  var updatedList = list.set({
    "icon": icon
  });

  var saved = saveUser(user, updatedList);
  res.send(updatedList);
};

exports.deleteList = function(req, res, next) {
  var user = req.user;
  var listId = req.params.id;
  var list = user.lists.id(listId);

  var removedList = list.remove();
  var saved = saveUser(user, removedList);
  res.send(removedList);
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