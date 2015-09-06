//////////////////////
// GULP PATHS
//////////////////////

module.exports = {

  dest: {
    js: 'dist/js',
    css: 'dist/css'
  },

  views: {
    src: 'views/**/*.hbs'
  },

  less: {
    src: 'assets/less/*.less',
    watch: 'assets/less/**/*.less',
    filename: 'style.css',
    min: 'style.min.css'
  },

  js: {
    src: [
      'assets/js/models.js',
      'assets/js/authentication.js',
      'assets/js/http.js',
      'assets/js/view.js',
      'assets/js/mobile.js',
      'assets/js/listeners.js',
      'assets/js/views/**/*.js',
      'assets/js/main.js'
    ],
    watch: [
      'assets/js/**/*.js',
      '!assets/js/vendor/**/*.js'
    ],
    filename: 'scripts.js',
    min: 'scripts.min.js',
    vendor: {
      src: [
        'assets/js/vendor/jquery.js',
        'assets/js/vendor/underscore.js',
        'assets/js/vendor/backbone.js',
        'assets/js/vendor/handlebars.runtime.js',
        'assets/js/vendor/handlebars.js',
        'assets/js/vendor/bootstrap.js',
        'assets/js/vendor/autosize.js',
      ],
      filename: 'vendor.js',
      min: 'vendor.min.js'
    }
  },

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
  }
};