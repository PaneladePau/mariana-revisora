'use strict';

var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    minify = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    jpgCompress = require('imagemin-jpeg-recompress'),
    connect = require('gulp-connect'),
    pngCompress = require('gulp-tinypng');

var devPath = 'resource-dev',
    distPath = 'resource';

// IMAGES

gulp.task('clean:images', function() {
  return del([
    distPath + '/img/*',
    distPath + '/img/sprite.*'
  ]);
});

gulp.task('copy:images', ['clean:images'], function() {
  return gulp.src([
      devPath + '/img/**/*.*',
      '!' + devPath + '/img/sprite-src/*',
      '!' + devPath + '/img/sprite.*'
    ])
    .pipe(gulp.dest(distPath + '/img'))
    .pipe(livereload());
});

gulp.task('jpgCompress', ['copy:images'], function() {
  return gulp.src(distPath + '/img/**/*.jpg')
    .pipe(jpgCompress({
      quality: 'high'
    })())
    .pipe(gulp.dest(distPath + '/img'));
});

gulp.task('pngCompress', ['copy:images', 'build:css'], function() {
  return gulp.src([
      distPath + '/img/**/*.png'
    ])
    .pipe(pngCompress('VqZLFmu-8dZ3f499y7Jav4l_CVtnsdSP'))
    .pipe(gulp.dest(distPath + '/img'));
});

gulp.task('imgCompress', ['jpgCompress', 'pngCompress']);

// CSS

gulp.task('clean:css', function() {
  return del(distPath + '/css/*');
});

gulp.task('build:css', ['clean:css'], function() {
  return gulp.src(devPath + '/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(distPath + '/css'))
    .pipe(livereload());
});

gulp.task('copy:css', ['build:css'], function() {
  return gulp.src(distPath + '/css/*')
    .pipe(gulp.dest('.tmp/css'));
});

gulp.task('minify', ['copy:css'], function() {
  return gulp.src('.tmp/css/*')
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(gulp.dest(distPath + '/css'));
});

//JS

gulp.task('clean:js', function() {
  return del([
    '.tmp/js/*',
    '!.tmp/js/tools/*',
    distPath + '/js/main.js'
  ]);
});

gulp.task('clean:jstools', function() {
  return del([
    '!.tmp/js/*',
    '.tmp/js/tools/*',
    distPath + '/js/tools.js'
  ]);
});

gulp.task('build:js', ['clean:js'], function() {
  return gulp.src([devPath + '/js/**/*.js', '!' + devPath + '/js/tools/*'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(distPath + '/js'))
    .pipe(livereload());
});

gulp.task('build:jstools', ['clean:jstools'], function() {
  return gulp.src(devPath + '/js/tools/*')
    .pipe(concat('tools.js'))
    .pipe(gulp.dest(distPath + '/js'))
    .pipe(livereload());
});

gulp.task('copy:concat', ['build:js', 'build:jstools'], function() {
  return gulp.src(distPath + '/js/**/*.js')
    .pipe(gulp.dest('.tmp/js'));
});

gulp.task('uglify', ['copy:concat'], function() {
  return gulp.src('.tmp/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(distPath + '/js'));
});

// FONTS

gulp.task('clean:fonts', function() {
  return del([
    distPath + '/fonts/*'
  ]);
});

gulp.task('copy:fonts', ['clean:fonts'], function() {
  return gulp.src(devPath + '/fonts/**/*.*')
    .pipe(gulp.dest(distPath + '/fonts'));
});

// TEMPLATE

gulp.task('reload:template', function() {
  return gulp.src([ '!node_modules/**/*.html', '!zohoverify/**/*.html', '**/*.html' ])
    .pipe(gulp.dest('./'))
    .pipe(livereload());
});

// WORKFLOW

gulp.task('default', function() {
  process.stdout.write('\nPlease, use `gulp build` instead\n\n');
});

gulp.task('prepare:dev', ['build:js', 'build:jstools', 'build:css', 'copy:images', 'copy:fonts']);

// SERVE

gulp.task('serve', ['prepare:dev'], function() {
  
  livereload.listen();

  connect.server({
    root: './',
    port: 9000,
    reload: true
  });
  
  // CSS
  gulp.watch(
    [
      devPath + '/scss/**/*.scss'
    ],
    [
      'build:css'
    ]
  );
  // JS
  gulp.watch(
    [
      devPath + '/js/**/*.js',
      '!' + devPath + '/js/tools/*.*.js'
    ],
    [
      'build:js'
    ]
  );
  gulp.watch(
    [
      '!' + devPath + '/js/**/*.js',
      devPath + '/js/tools/*'
    ],
    [
      'build:jstools'
    ]
  );
  // IMG
  gulp.watch(
    [
      devPath + '/img/*',
    ],
    [
      'copy:images',
      'build:css'
    ]
  );
  // TEMPLATE
  gulp.watch(
    [
      '!node_modules/**/*.html',
      '!zohoverify/**/*.html',
      './**/*.html'
    ],
    [
      'reload:template'
    ]
  );
});

// BUILD

gulp.task('build', ['minify', 'uglify', 'imgCompress', 'copy:fonts']);
