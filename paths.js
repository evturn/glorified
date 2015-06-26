module.exports = {
  js: {
    src: [
      'assets/js/**/*.js',
      'paths.js',
      'gulpfile.js',
      'main.js'
    ],
    watch: [
      'assets/js/**/*.js',
      'paths.js',
      'gulpfile.js',
      'main.js'
    ]
  },
  less: {
    src: 'assets/less/*.less',
    watch: 'assets/less/**/*.less',
    dest: 'dist'
  },
  font: {
    src: 'assets/fonts/**.*',
    dest: 'dist'
  },
  css: {
    src: [
    'assets/css/bootstrap.css',
    'assets/css/fontawesome.css',
    'assets/css/animate.min.css'
    ],
    dest: 'dist'
  }
};