var notes = new RAMENBUFFET.Notes();
var wrapper = new RAMENBUFFET.App({collection: notes});

RAMENBUFFET.init = function() {
    RAMENBUFFET.lists.init();
    RAMENBUFFET.e.init();
    new WOW().init();
};

$(document).ready(function() {
  RAMENBUFFET.init();
});