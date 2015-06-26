var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    size = require('gulp-filesize'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean');

gulp.task('default', ['less']);

gulp.task('less', function() {
  return gulp.src('assets/less/**/*.less')
    .pipe(watch('assets/less/**/*.less'))
    .pipe(less())
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  gulp.src(js.build)
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