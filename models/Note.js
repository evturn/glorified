var mongoose = require('mongoose');
var NoteSchema = require('../config/schema').Note();

module.exports = mongoose.model('Note', NoteSchema);