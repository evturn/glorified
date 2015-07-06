var mongoose = require('mongoose');
var schema = require('../config/schema').Note();

schema.pre('save', function(next) { 
  var note = this;
  
    if (!note.timestamp) {
      var created = note.created;
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
      var d = date;
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();
      var hours = d.getHours();
      var minutes = d.getMinutes();
      var meridiem = hours > 12 ? 'PM' : 'AM';
      var hour = hours > 12 ? hours - 12 : hours;
      month = ('' + (month + 1)).slice(-2);
      var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + minutes + meridiem;
      note.timestamp = timestamp;
      next();
    }
  
});

module.exports = mongoose.model('Note', schema);