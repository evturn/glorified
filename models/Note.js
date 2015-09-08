var Note = require('./schema').Note(),
    mongoose = require('mongoose');

module.exports = mongoose.model('Note', Note);