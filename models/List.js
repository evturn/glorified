var mongoose = require('mongoose');
var ListSchema = require('../config/schema').List();

module.exports = mongoose.model('List', ListSchema);