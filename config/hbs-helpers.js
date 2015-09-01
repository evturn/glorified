module.exports = {

  debug: function(val) {
    console.log('Current Context');
    console.log('====================');
    console.log(this);
    if (val) {
        console.log('Value');
        console.log('====================');
        console.log(val);
    }
  },

  greeting: function() {
    var date = new Date(),
        time = date.getHours();

    switch (time) {
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return "Good Morning";
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        return "Good Afternoon";
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return "Good Evening";
    }
  }

};