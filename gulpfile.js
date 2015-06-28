var gulp = require('gulp'),
    gutil = require('gulp-util'), 
    gError = require('./config/gulp-error-handler'), 
    G = require('gulp-load-plugins')();

var paths = require('./config/paths');
var bConfig = require('./config/gulp-browserify'),
    b = bConfig.browserifyOptions(),
    bundle = bConfig.bundle;

gulp.task('default', ['browserify', 'less', 'css', 'lint', 'watch']);

gulp.task('watch', function() {
  gulp.watch(paths.less.watch, ['less']);
  gulp.watch(paths.linter.watch, ['lint']);
  gulp.watch(paths.js.watch, ['client']);
});

gulp.task('browserify', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

gulp.task('client', function() {
  return gulp.src(paths.js.src)
    .pipe(G.plumber(gError))
    .pipe(G.concat('min.js'))
    .pipe(G.uglify())
    .pipe(G.rename(paths.js.filename))
    .pipe(gulp.dest(paths.js.dest));
});

gulp.task('css', function() {
  return gulp.src(paths.css.src)
    .pipe(G.plumber(gError))
    .pipe(G.concat('min.css'))
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
    .pipe(G.plumber({errorHandler: gError}))
    .pipe(G.less())
    .pipe(G.rename(paths.less.filename))
    .on('error', function (err) {
        gutil.log(err);
        G.notify(err);
        this.emit('end');
    })
    .pipe(G.autoprefixer({
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
    .pipe(G.cssmin())
    .pipe(gulp.dest(paths.less.dest)).on('error', gutil.log);
});

gulp.task('lint', function() {
  gulp.src(paths.linter.src)
    .pipe(G.plumber({errorHandler: gError}))
    .pipe(G.jshint())
    .pipe(G.notify(function(file) {
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