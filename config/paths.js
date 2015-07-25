// jslint     - all
// less
// fonts
// css        - vendor only
// browserify - client and vendor js
// js         - client only

module.exports = {

  jshint: {
    src: [
      'assets/js/**/*.js',
      '!assets/js/vendor/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js'
    ],
    watch: [
      'assets/js/**/*.js',
      '!assets/js/vendor/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js'
    ]
  },

  less: {
    src: 'assets/less/*.less',
    watch: 'assets/less/**/*.less',
    dest: 'dist/css',
    filename: 'less.css'
  },

  font: {
    src: 'assets/fonts/**.*',
    dest: 'dist/fonts'
  },

  css: {
    src: [
    'assets/css/**/*.css'
    ],
    dest: 'dist/css',
    filename: 'vendor.css'
  },

  js: {
    src: [
      'assets/js/ramenbuffet/models.js',
      'assets/js/ramenbuffet/functions.js',
      'assets/js/ramenbuffet/http.js',
      'assets/js/ramenbuffet/listeners.js',
      'assets/js/ramenbuffet/init.js',
      'assets/js/views/**/*.js',
      'assets/js/main.js'
    ],
    watch: [
      'assets/js/views/**/*.js',
      'assets/js/ramenbuffet/**/*.js',
      'assets/js/main.js'
    ],
    dest: 'dist/js',
    filename: 'scripts.min.js',
    vendor: {
      src: [
        'assets/js/vendor/jquery.js',
        'assets/js/vendor/underscore.js',
        'assets/js/vendor/backbone.js',
        'assets/js/vendor/bootstrap.js',
        'assets/js/vendor/wow.js'
      ],
      dest: 'dist/js',
      filename: 'vendor.js'
    }
  }
};