module.exports = {
  js: {
    src: [
      'assets/js/**/*.js',
      '!assets/js/lib/**/*.js',
      'paths.js',
      'gulpfile.js',
      'main.js'
    ],
    watch: [
      'assets/js/**/*.js',
      '!assets/js/lib/**/*.js',
      'paths.js',
      'gulpfile.js',
      'main.js'
    ]
  },
  less: {
    src: 'assets/less/*.less',
    watch: 'assets/less/**/*.less',
    dest: 'dist/css'
  },
  font: {
    src: 'assets/fonts/**.*',
    dest: 'dist/fonts'
  },
  css: {
    src: [
    'assets/css/bootstrap.css',
    'assets/css/fontawesome.css',
    'assets/css/animate.min.css'
    ],
    dest: 'dist/css'
  },
  main: {
    src: 'main.js',
    dest: 'dist/js',
    name: 'bundle.js'
  } 
};