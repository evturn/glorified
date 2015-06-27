var gulp = require('gulp'),
    gutil = require('gulp-util'),  
    G = require('gulp-load-plugins')();

var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');

var paths = require('./config/paths');

var onError = function(err) {
    console.log(err);
};

// Default & Watch
gulp.task('default', ['js', 'less', 'lint', 'watch']);
gulp.task('watch', function() {
  gulp.watch(paths.less.watch, ['less']);
  gulp.watch(paths.js.watch, ['lint']);
});

var customOpts = {
  entries: ['./main.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts)); 

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(G.sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(G.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist/js'));
}




gulp.task('css', function() {
  return gulp.src(paths.css.src)
    .pipe(G.plumber({errorHandler: onError}))
    .pipe(G.cssmin())
    .pipe(G.rename('vendor.min.css'))
    .pipe(gulp.dest(paths.css.dest));
});

gulp.task('fonts', function() {
  return gulp.src(paths.font.src)
    .pipe(gulp.dest(paths.font.dest));
});

gulp.task('less', function() {
  return gulp.src(paths.less.src)
    .pipe(G.plumber({errorHandler: onError}))
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
    .pipe(gulp.dest(paths.less.dest)).on('error', gutil.log);
});

gulp.task('lint', function() {
  gulp.src(paths.js.src)
    .pipe(G.plumber({errorHandler: onError}))
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