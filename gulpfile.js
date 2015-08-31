var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')();

var paths = require('./config/gulp-paths');
var options = require('./config/gulp-options');

gulp.task('default', ['watch', 'nodemon', 'less', 'lint'], function() {
  browserSync.init(options.browserSync);
});

gulp.task('frontend', ['less:watch', 'babel:watch', 'lint']);

gulp.task('watch', function() {
  gulp.watch(paths.less.watch, ['reloader']);
  gulp.watch(paths.jshint.watch, ['lint']);
  gulp.watch(paths.js.watch, ['reloader']);
  gulp.watch(paths.views.src, ['reloader']);
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

gulp.task('js:vendor', function() {
  return gulp.src(paths.js.vendor.src)
    .pipe($.plumber(options.plumber))
    .pipe($.concat(paths.js.vendor.filename))
    .pipe($.uglify())
    .pipe($.rename(paths.js.vendor.filename))
    .pipe(gulp.dest(paths.js.vendor.dest));
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

gulp.task('less:watch', function() {
  gulp.watch(paths.less.watch, ['less']);
});

gulp.task('babel:watch', function() {
  gulp.watch(paths.js.watch, ['babel']);
});

gulp.task('babel', function () {
  return gulp.src(paths.js.src)
    .pipe($.plumber(options.plumber))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .on('error', options.plumber.errorHandler)
    .pipe($.concat(paths.babel.filename))
    .pipe(gulp.dest(paths.js.dest))
    .pipe($.uglify(paths.js.src))
    .pipe($.rename(paths.babel.min))
    .pipe(gulp.dest(paths.js.dest))
    .pipe($.sourcemaps.write('.'))
    .on('error', gutil.log);
});

gulp.task('reloader', ['babel', 'less'], function() {
  browserSync.reload();
});

gulp.task('nodemon', function() {
  $.nodemon(options.nodemon);
});

gulp.task('browsersync', function() {
  browserSync.init(null, options.browserSync);
});