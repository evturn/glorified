const querySelectorAll = document.querySelectorAll.bind(document);

const querySelector = document.querySelector.bind(document);

const toggleClass = function toggleClass(selector, className, condition) {
  condition ? selector.classList.remove(className) : selector.classList.add(className);
};

const addEvent = function(object, type, callback) {
  if (object === null || typeof(object) === 'undefined') {
      return false;
  }

  if (object.addEventListener) {
      object.addEventListener(type, createCallback(callback), false);
  }
  else if (object.attachEvent) {
      object.attachEvent('on' + type, createCallback(callback));
  }
  else {
      object['on' + type] = createCallback(callback);
  }

  function createCallback(fn) {
    let callback = function() {
        fn();
    };

    return callback;
  };
};