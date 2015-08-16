var mongoose = require('mongoose');
var ListSchema = require('../config/schema').List();

ListSchema.pre('validate', function(doc) {
  return doc._id;
});

ListSchema.method('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
});


module.exports = mongoose.model('List', ListSchema);