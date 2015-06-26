var gulp = require('gulp'),
    gutil = require('gulp-util'),  
    G = require('gulp-load-plugins')();

var paths = require('./paths'),
    less = paths.less,
    font = paths.font,
    css = paths.css,
    js = paths.js;

gulp.task('default', ['less', 'lint', 'watch']);

gulp.task('watch', function() {
  gulp.watch(less.watch, ['less']);
  gulp.watch(js.watch, ['lint']);
});

gulp.task('css', function() {
  return gulp.src(css.src)
    .pipe(G.cssmin())
    .pipe(G.rename('vendor.min.css'))
    .pipe(gulp.dest(css.dest));
});

gulp.task('fonts', function() {
  return gulp.src(font.src)
    .pipe(gulp.dest(font.dest));
});

gulp.task('less', function() {
  return gulp.src(less.src)
    .pipe(G.plumber())
    .pipe(G.less())
    .pipe(G.rename('style.min.css'))
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
    .pipe(gulp.dest(less.dest)).on('error', gutil.log);
});

gulp.task('lint', function() {
  gulp.src(js.src)
    .pipe(G.plumber())
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