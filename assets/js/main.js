var wrapper = new RAMENBUFFET.Wrapper();


RAMENBUFFET.init = function() {
    RAMENBUFFET.lists.init();
    RAMENBUFFET.e.init();
    new WOW().init();
};

$(document).ready(function() {
  RAMENBUFFET.init();
});