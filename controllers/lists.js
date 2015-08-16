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

  var saveUser = function(user) {
    user.save(function(err, data) {
      if (err) {
        return console.log(err);
      }
      console.log('We made it here ', data);
      res.send(data);
    });
  };

  var newNote = new Note({
    list: data.list,
    body: data.body,
    done: data.done
  });

  for (var i = 0; i < listsArray.length; i++) {
    counter += 1;
    var list = listsArray[i];

    if (list.name === data.list) {
      console.log(list.name + ' matches ' + data.list);
      var userList = user.lists.id(list._id);

      userList.notes.push(newNote);
      saveUser(user);
    }
    else if (list.name !== data.list && counter === listsArray.length) {
      console.log('New list created: ' + data.list);
      var newList = new List({
        name: data.list
      });

      newList.notes.push(newNote);
      user.lists.push(newList);
      saveUser(user);
    }
  }

};

