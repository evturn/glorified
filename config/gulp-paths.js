//////////////////////
// GULP PATHS
//////////////////////

module.exports = {

  dest: {
    js: 'public/dist/js',
    css: 'public/dist/css'
  },
  views: {
    src: 'views/**/*.hbs'
  },
  less: {
    src: 'public/less/*.less',
    watch: 'public/less/**/*.less',
    filename: 'style.css',
    min: 'style.min.css',
    landing: {
      src: 'public/less/landing/style.less',
      filename: 'landing.css',
      min: 'landing.min.css'
    }
  },
  js: {
    src: [
      'public/js/utils.js',
      'public/js/models.js',
      'public/js/events.js',
      // 'public/js/listeners.js',
      'public/js/http.js',
      'public/js/view.js',
      'public/js/mobile.js',
      'public/js/views/**/*.js',
      'public/js/main.js'
    ],
    watch: [
      'public/js/**/*.js',
      '!public/js/vendor/**/*.js'
    ],
    filename: 'scripts.js',
    min: 'scripts.min.js',
    vendor: {
      src: [
        'public/js/vendor/jquery.js',
        'public/js/vendor/underscore.js',
        'public/js/vendor/backbone.js',
        'public/js/vendor/autosize.js',
        'public/js/icons.js'
      ],
      filename: 'vendor.js',
      min: 'vendor.min.js'
    },
    auth: {
      src: [
        'public/js/auth/landing.js'
      ],
      watch: 'public/js/auth/**/*.js',
      filename: 'auth.js',
      min: 'auth.min.js'
    }
  },
  eslint: {
    src: [
      'public/js/**/*.js',
      '!public/js/vendor/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js'
    ],
    watch: [
      'public/js/**/*.js',
      '!public/js/vendor/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js'
    ]
  },
  jshint: {
    src: [
      'public/js/**/*.js',
      '!public/js/vendor/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js'
    ],
    watch: [
      'public/js/**/*.js',
      '!public/js/vendor/**/*.js',
      'config/**/*.js',
      'models/**/*.js',
      'controllers/**/*.js',
      'routes/**/*.js',
      'server.js',
      'gulpfile.js'
    ]
  }
};