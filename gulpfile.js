var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')();

var paths = require('./config/paths');
var options = require('./config/gulp-options');

gulp.task('default', ['nodemon', 'less', 'lint', 'watch', 'browsersync']);

gulp.task('watch', function() {
  gulp.watch(paths.less.watch, ['less', 'reloader']);
  gulp.watch(paths.jshint.watch, ['lint']);
  gulp.watch(paths.js.watch, ['js', 'reloader']);
  gulp.watch('./**/*.hbs').on('change', browserSync.reload);
});

gulp.task('less', function() {
  return gulp.src(paths.less.src)
    .pipe($.plumber(options.plumber))
    .pipe($.less())
    .pipe($.rename(paths.less.filename))
    .on('error', options.plumber.errorHandler)
    .pipe($.autoprefixer(options.autoprefixer))
    .pipe($.cssmin())
    .pipe(gulp.dest(paths.less.dest)).on('error', gutil.log);
});

gulp.task('js', function() {
  return gulp.src(paths.js.src)
    .pipe($.plumber(options.plumber))
    .pipe($.concat('scripts.js'))
    .pipe(gulp.dest(paths.js.dest))
    .pipe($.rename(paths.js.filename))
    .pipe(gulp.dest(paths.js.dest))
    .on('error', gutil.log);
});

gulp.task('jslib', function() {
  return gulp.src(paths.js.vendor.src)
    .pipe($.plumber(options.plumber))
    .pipe($.concat(paths.js.vendor.filename))
    .pipe($.uglify())
    .pipe($.rename(paths.js.vendor.filename))
    .pipe(gulp.dest(paths.js.vendor.dest));
});

gulp.task('css', function() {
  return gulp.src(paths.css.src)
    .pipe($.plumber(options.plumber))
    .pipe($.concat(paths.css.filename))
    .pipe($.cssmin())
    .pipe($.rename(paths.css.filename))
    .pipe(gulp.dest(paths.css.dest));
});

gulp.task('fonts', function() {
  return gulp.src(paths.font.src)
    .pipe(gulp.dest(paths.font.dest));
});

gulp.task('lint', function() {
  gulp.src(paths.jshint.src)
    .pipe($.plumber(options.plumber))
    .pipe($.jshint())
    .pipe($.notify(options.notify.jshint));
});

gulp.task('nodemon', function() {
  $.nodemon(options.nodemon);
});

gulp.task('reloader', ['less'], function() {
  browserSync.reload();
});

gulp.task('browsersync', function() {
  browserSync.init(null, options.browserSync);
});