var gulp = require('gulp'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')(),
    paths = require('./config/gulp-paths'),
    opts = require('./config/gulp-options'),
    path = require('path'),
    through = require('through2'),
    lodash = require('lodash._createwrapper');

gulp.task('default', ['less:watch', 'js:watch', 'eslint:watch', 'browserSync']);

//////////////////////
// WATCH
//////////////////////

gulp.task('less:watch', function() {
  gulp.watch(paths.less.watch, ['less:reload']);
});

gulp.task('js:watch', function() {
  gulp.watch(paths.js.watch, ['js:reload']);
});

gulp.task('eslint:watch', function() {
  gulp.watch(paths.eslint.watch, ['eslint']);
});

//////////////////////
// BROWSERSYNC
//////////////////////

gulp.task('browserSync', function() {
    browserSync.init(opts.browserSync);
    gulp.watch(paths.views.src).on('change', browserSync.reload);
});

gulp.task('less:reload', ['less'], function() {
    browserSync.reload();
});

gulp.task('js:reload', ['js'], function() {
    browserSync.reload();
});

//////////////////////
// LESS
//////////////////////

gulp.task('less', function() {
  return gulp.src(paths.less.src)
    .pipe($.plumber(opts.plumber))
    .pipe($.less())
    .pipe($.rename(paths.less.filename))
    .pipe(gulp.dest(paths.dest.css))
    .on('error', opts.plumber.errorHandler)
    .pipe($.autoprefixer(opts.autoprefixer))
    .pipe($.cssmin())
    .pipe($.rename(paths.less.min))
    .pipe(gulp.dest(paths.dest.css)).on('error', gutil.log);
});

gulp.task('less:landing', function() {
  return gulp.src(paths.less.landing.src)
    .pipe($.plumber(opts.plumber))
    .pipe($.less())
    .pipe($.rename(paths.less.landing.filename))
    .pipe(gulp.dest(paths.dest.css))
    .on('error', opts.plumber.errorHandler)
    .pipe($.autoprefixer(opts.autoprefixer))
    .pipe($.cssmin())
    .pipe($.rename(paths.less.landing.min))
    .pipe(gulp.dest(paths.dest.css)).on('error', gutil.log);
});

gulp.task('less:watch', function() {
  gulp.watch(paths.less.watch, ['less:reload']);
});

gulp.task('less:reload', ['less', 'less:landing'], function() {
    browserSync.reload();
});

//////////////////////
// BABEL
//////////////////////

gulp.task('js', function() {
  return gulp.src(paths.js.src)
    .pipe($.plumber(opts.plumber))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .on('error', opts.plumber.errorHandler)
    .pipe($.concat(paths.js.filename))
    .pipe(gulp.dest(paths.dest.js))
    .pipe($.uglify())
    .pipe($.rename(paths.js.min))
    .pipe(gulp.dest(paths.dest.js))
    .pipe($.sourcemaps.write('.'))
    .on('error', gutil.log);
});

//////////////////////
// JS:VENDOR
//////////////////////

gulp.task('js:vendor', function() {
  return gulp.src(paths.js.vendor.src)
    .pipe($.plumber(opts.plumber))
    .pipe($.concat(paths.js.vendor.filename))
    .pipe(gulp.dest(paths.dest.js))
    .pipe($.uglify())
    .pipe($.rename(paths.js.vendor.min))
    .pipe(gulp.dest(paths.dest.js))
    .on('error', gutil.log);
});


gulp.task('js:landing', function() {
  return gulp.src(paths.js.auth.src)
    .pipe($.plumber(opts.plumber))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .on('error', opts.plumber.errorHandler)
    .pipe($.concat(paths.js.auth.filename))
    .pipe(gulp.dest(paths.dest.js))
    .pipe($.uglify())
    .pipe($.rename(paths.js.auth.min))
    .pipe(gulp.dest(paths.dest.js))
    .pipe($.sourcemaps.write('.'))
    .on('error', gutil.log);
});

//////////////////////
// ESLINT
//////////////////////

gulp.task('eslint', function() {
  return gulp.src(paths.eslint.src)
    .pipe($.plumber(opts.plumber))
    .pipe($.eslint())
    .on('error', opts.plumber.errorHandler)
    .pipe($.eslint.format('stylish'))
    .pipe($.notify(opts.notify.eslint));
});

//////////////////////
// NODEMON
//////////////////////

gulp.task('nodemon', function() {
  $.nodemon(opts.nodemon);
});