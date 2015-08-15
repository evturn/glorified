var express = require('express');
var mongoose = require('mongoose');
var User = require('../config/schema');

exports.getAll = function(req, res, next) {
  res.json(req.user);
};