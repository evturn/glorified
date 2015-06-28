// jslint     - all
// less
// fonts
// css        - vendor only
// browserify - client and vendor js
// js         - client only

module.exports = {
  jslint: {
    src: [
      'assets/js/**/*.js',
      '!assets/js/lib/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js',
      'browser.js'
    ],
    watch: [
      'assets/js/**/*.js',
      '!assets/js/lib/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js',
      'browser.js'
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
  browser: {
    src: [
      'browser.js'
    ],
    dest: 'dist/js',
    filename: 'bundle.js'
  },
  js: {
    src: [
      'assets/js/models/rb.js',
      'assets/js/rb.js',
      'assets/js/router.js',
      'assets/js/main.js'
    ],
    watch: [
      'assets/js/models/**/*.js',
      'assets/js/rb.js',
      'assets/js/views/**/*.js',
      'assets/js/router.js',
      'assets/js/main.js'
    ],
    dest: 'dist/js',
    filename: 'rb.js'
  },
  jslib: {
    src: [
      'assets/js/lib/jquery.js',
      'assets/js/lib/underscore.js',
      'assets/js/lib/backbone.js',
      'assets/js/lib/bootstrap.js',
      'assets/js/lib/wow.js',
    ],
    dest: 'dist/js',
    filename: 'jslib.js'
  }
};