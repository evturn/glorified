RAMENBUFFET.ActiveList = Backbone.View.extend({
  el: '.active-list-wrapper',
  list: null,
  inputTemplate: _.template($('#active-list-name').html()),
  initialize: function(list) {
    this.list = list;
    this.render();
  },
  events: {
    'click .create-note-btn' : 'createNote',
    'keypress .note-input'   : 'createOnEnter',
    'keyup .active-input'    : 'validate'
  },
  render: function() {
    var self = this;
    var listName;
    for (var i = 0; i < this.list.length; i++) {
      listName = {name: this.list[i].get('list')};
    }
    $('.form-list-name').html(this.inputTemplate(listName));
  },
  createOnEnter: function(e) {
    if (e.keyCode === 13) {
      this.createNote();
    }
  },
  validate: function(e) {
    var body = $('.note-input').val();
    var list = $('.list-input').val();
    if (body.trim() && list.trim() !== '') {
      $('.create-note-btn .fa').addClass('ready');
    } else {
      $('.create-note-btn .fa').removeClass('ready');
    }
  },
  createNote: function() {
    var self = this;
    var body = $('.note-input').val();
    var list = $('.list-input').val();
    if (body === '' || list === '') {
      return false;
    }
    var created = Date.now();
    var timestamp = this.convertDate(created);

    if (wrapper.collection.findWhere({body: body})) {
      // Prevents duplicate saves
      return false;
    }
    var note = {
        body: body,
        list: list,
        created: created,
        timestamp: timestamp
    };
    RAMENBUFFET.http.post(self, note);
  },
  convertDate: function(date) {
    var d = new Date(date);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var min = minutes > 10 ? ('0' + minutes) : minutes;
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    var hour = hours > 12 ? hours - 12 : hours;
    month = ('' + (month + 1)).slice(-2);
    var timestamp = days[d.getDay()] + ' ' + month + '/' + day + ' ' + hour + ':' + min + meridiem;
    return timestamp;
  },
});