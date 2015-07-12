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
      '!assets/js/lib/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js'
    ],
    watch: [
      'assets/js/**/*.js',
      '!assets/js/lib/**/*.js',
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
    'assets/css/bootstrap.css',
    'assets/css/font-awesome.css',
    'assets/css/animate.min.css'
    ],
    dest: 'dist/css',
    filename: 'vendor.css'
  },
  js: {
    src: [
      'assets/js/models/**/*.js',
      'assets/js/views/**/*.js',
      'assets/js/ramenbuffet/**/*.js',
      'assets/js/main.js'
    ],
    watch: [
      'assets/js/models/**/*',
      'assets/js/views/**/*',
      'assets/js/ramenbuffet/**/*.js',
      'assets/js/main.js'
    ],
    dest: 'dist/js',
    filename: 'scripts.min.js',
    vendor: {
      src: [
        'assets/js/lib/jquery.js',
        'assets/js/lib/underscore.js',
        'assets/js/lib/backbone.js',
        'assets/js/lib/bootstrap.js',
        'assets/js/lib/wow.js'
      ],
      dest: 'dist/js',
      filename: 'vendor.js'
    }
  }
};