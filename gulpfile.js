var gulp = require('gulp'),
    gutil = require('gulp-util'),  
    G = require('gulp-load-plugins')();
var paths = require('./config/paths');
var options = require('./config/gulp-options');
var gBrowserify= require('./config/gulp-browserify'),
    b = gBrowserify.options(),
    bundle = gBrowserify.bundle;

gulp.task('default', [
  'browserify', 
  'less', 
  'css', 
  'lint', 
  'watch'
]);

gulp.task('watch', function() {
  gulp.watch(paths.less.watch, ['less']);
  gulp.watch(paths.jslint.watch, ['lint']);
  gulp.watch(paths.js.watch, ['client']);
  gulp.watch(paths.browser.watch, ['browserify']);
});

gulp.task('browserify', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

gulp.task('client', function() {
  return gulp.src(paths.js.src)
    .pipe(G.plumber(options.plumber))
    .pipe(G.concat(paths.js.filename))
    .pipe(G.uglify())
    .pipe(G.rename(paths.js.filename))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('css', function() {
  return gulp.src(paths.css.src)
    .pipe(G.plumber(options.plumber))
    .pipe(G.concat(paths.css.filename))
    .pipe(G.cssmin())
    .pipe(G.rename(paths.css.filename))
    .pipe(gulp.dest(paths.css.dest));
});

gulp.task('fonts', function() {
  return gulp.src(paths.font.src)
    .pipe(gulp.dest(paths.font.dest));
});

gulp.task('less', function() {
  return gulp.src(paths.less.src)
    .pipe(G.plumber(options.plumber))
    .pipe(G.less())
    .pipe(G.rename(paths.less.filename))
    .on('error', options.plumber.errorHandler)
    .pipe(G.autoprefixer(options.autoprefixer))
    .pipe(G.cssmin())
    .pipe(gulp.dest(paths.less.dest)).on('error', options.plumber.errorHandler);
});

gulp.task('lint', function() {
  gulp.src(paths.jslint.src)
    .pipe(G.plumber(options.plumber))
    .pipe(G.jshint())
    .pipe(G.notify(options.notify.jshint));
});