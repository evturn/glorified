var List = require('./schema').List(),
    mongoose = require('mongoose');

List.pre('validate', function(doc) {
  return doc._id;
});

List.method('findByName', function (name, callback) {
  return this.find({
    name: name
  }, callback);
});

module.exports = mongoose.model('List', List);