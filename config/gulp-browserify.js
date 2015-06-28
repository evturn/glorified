var gulp = require('gulp'),
    gutil = require('gulp-util'), 
    gError = require('./gulp-error-handler'), 
    G = require('gulp-load-plugins')();

var browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    assign = require('lodash.assign');

var paths = require('./paths');

var b = function() {
  var customOpts = {
    entries: [paths.browser.src],
    debug: true
  };
  var opts = assign({}, watchify.args, customOpts);
  return watchify(browserify(opts));
}();

exports.options = function() {
  var customOpts = {
    entries: [paths.browser.src],
    debug: true
  };
  var opts = assign({}, watchify.args, customOpts);
  return watchify(browserify(opts));
};

exports.bundle = function() {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(paths.browser.filename))
    .pipe(buffer())
    .pipe(G.sourcemaps.init({loadMaps: true}))
    .pipe(G.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.browser.dest));
};