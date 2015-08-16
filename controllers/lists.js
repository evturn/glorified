var express = require('express');
var mongoose = require('mongoose');
var User = require('../models/User');
var List = require('../models/List');
var Note = require('../models/Note');

exports.getAll = function(req, res, next) {
  res.json(req.user);
};

exports.post = function(req, res, next) {
  var user = req.user;
  var data = req.body;

  console.log(data);

  if (user.lists.indexOf(data.list) === -1) {
    console.log(data.list + ' is not in there ');

    var newNote = new Note({
      list: data.list,
      body: data.body,
      done: data.done
    });

    var newList = new List({
      name: data.list
    });

    newList.notes.push(newNote);
    console.log(newList);
    user.lists.push(newList);

    user.save(function(err, data) {
      if (err) {
        return console.log(err);
      }
      console.log('We made it here ', data);
      res.send(data);
    })

  }
  else {
    console.log(data.list + ' exists ');
  }

};