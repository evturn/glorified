var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    gless = require('gulp-less'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    size = require('gulp-filesize'),
    notify = require('gulp-notify'),
    clean = require('gulp-clean'),
    watchLess = require('gulp-watch-less'),
    plugins = require('gulp-load-plugins')();

var paths = require('./paths'),
    less = paths.less,
    js = paths.js;

gulp.task('default', ['less', 'lint', 'watch']);

gulp.task('watch', function() {
  gulp.watch(less.watch, ['less']);
  gulp.watch(js.watch, ['lint']);
});

gulp.task('less', function() {
  return gulp.src(less.src)
    .pipe(plugins.plumber())
    .pipe(plugins.less())
    .on('error', function (err) {
        gutil.log(err);
        notify(err);
        this.emit('end');
    })
    .pipe(plugins.autoprefixer({
      browsers: [
          '> 1%',
          'last 2 versions',
          'firefox >= 4',
          'safari 7',
          'safari 8',
          'IE 8',
          'IE 9',
          'IE 10',
          'IE 11'
      ],
      cascade: false
    }))
    .pipe(plugins.cssmin())
    .pipe(gulp.dest(less.dest)).on('error', gutil.log);
});

gulp.task('lint', function() {
  gulp.src(js.src)
    .pipe(jshint())
    .pipe(notify(function(file) {
      if (file.jshint.success) {
        return false;
      }
      var errors = file.jshint.results.map(function(data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));
});