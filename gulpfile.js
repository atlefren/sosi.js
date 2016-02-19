'use strict';
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


function compile(watch) {
    var bundler = watchify(
        browserify('./src/browser.js', {debug: true})
    );

    function rebundle() {
        bundler.bundle()
            .on('error', function (err) { console.error(err); this.emit('end'); })
            .pipe(source('sosi.js'))
            .pipe(buffer())
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
            .pipe(gutil.env.type === 'production' ? rename({suffix: '.min'}): gutil.noop())
            .pipe(gutil.env.type === 'production' ? sourcemaps.init({loadMaps: true}): gutil.noop())
            .pipe(gutil.env.type === 'production' ? sourcemaps.write('./'): gutil.noop())
            .pipe(gulp.dest('./dist'));
    }

    if (watch) {
        bundler.on('update', function () {
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


gulp.task('test', function () {
    return gulp.src('test/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('lint', function () {
    return gulp.src(['gulpfile.js', 'src/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('build', function () { return compile(); });
gulp.task('watch', function () { return watch(); });
