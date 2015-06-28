var mongoose = require('mongoose');
var schema = require('../config/schema').Note();

module.exports = mongoose.model('Note', schema);