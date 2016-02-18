'use strict';
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');

function compile(watch) {
    var bundler = watchify(
        browserify('./src/index.jsx', {debug: true})
            .transform(babel, {presets: ['es2015', 'react']})
    );

    function rebundle() {
        bundler.bundle()
            .on('error', function (err) { console.error(err); this.emit('end'); })
            .pipe(source('package.js'))
            .pipe(buffer())
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
            .pipe(gutil.env.type === 'production' ? rename({suffix: '.min'}): gutil.noop())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    }

    if (watch) {
        bundler.on('update', function () {
            lint();
            console.log('-> bundling...');
            rebundle();
            console.log('-> done!');
        });
    }
  rebundle();
}

function watch() {
    return compile(true);
};

function lint() {
    gulp.src(['gulpfile.js', 'src/**/*.jsx'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

gulp.task('lint', lint);

gulp.task('build', function () { return compile(); });
gulp.task('watch', function () { return watch(); });

gulp.task('default', ['watch']);
