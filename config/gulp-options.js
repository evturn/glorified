var gulp = require('gulp'),
    gutil = require('gulp-util'),
    $ = require('gulp-load-plugins')();

module.exports = {

  eslint: {
    useEslintrc: true,
    sound: 'Submarine',
    contentImage: '../evturn.github.io/dist/img/evturn.jpg'
  },
  nodemon: {
    script: 'server.js',
    ignore: [
      'assets/**/*.js'
    ],
  },
  browserSync: {
    proxy: 'localhost:3000',
    port: 3000
  },

  plumber: {
    errorHandler: function(err) {
      gutil.beep();
      console.log(err);
      this.emit('end');
      $.notify(err);
    }
  },
  notify: {
    eslint: function(file) {
      if (file.eslint.errorCount === 0) {
        return false;
      }
      var errors = file.eslint.messages.map(function(data) {
        return '(' + data.line + ':' + data.column + ') ' + data.message;
      }).join('\n');

      return file.relative + ' (' + file.eslint.errorCount + ' errors)\n' + errors;
    },
    jshint: function(file) {
      if (file.jshint.success) {
        return false;
      }
      var errors = file.jshint.results.map(function(data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }
  },
  autoprefixer: {
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
  }
};