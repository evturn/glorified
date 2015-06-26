module.exports = {
  js: {
    src: [
      'assets/js/**/*.js',
      'paths.js',
      'gulpfile.js',
      'main.js'
    ],
    watch: this.src
  },
  less: {
    src: 'assets/less/*.less',
    watch: 'assets/less/**/*.less',
    dest: 'dist'
  }
};