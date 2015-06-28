var mongodb       = require('mongodb');
var mongoose      = require('mongoose');
var dbName        = 'ramen-buffet';

module.exports = function(moongoose){
  
  mongoose.connect('mongodb://localhost/' + dbName, function(err) {
      if (err) {
        console.log('Ensure you\'re connected');
      }
    });

  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function callback() {
    console.log('Connected to DB: ' + dbName);
  });

};