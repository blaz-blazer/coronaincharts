let gulp = require('gulp');
let watch = require ('gulp-watch');
let browserSync = require('browser-sync').create();
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let cssvars = require('postcss-simple-vars');
let nested = require('postcss-nested');
let cssImport = require('postcss-import');
let mixins = require('postcss-mixins');
let hexrgba = require('postcss-hexrgba');
let webpack = require ('webpack');
var del = require('del');
var cleanCSS = require('gulp-clean-css');

//compiles public css from source
function cssCompile() {
  return gulp.src('./_dev/css/app.css') //source
  .pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
  .on('error', function(errorInfo) {
    console.log(errorInfo.toString());
    this.emit('end');
  })
  .pipe(gulp.dest('./css/')); //save to destination
}

//injects public css from source
function cssInject() {
  return gulp.src('./css/app.css')
  .pipe(browserSync.stream());
}

function jsCompile(callback) {
  webpack(require('./webpack.config.js'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }
    console.log(stats.toString());
    callback();
  });
}

//reload browser
function reload() {
	browserSync.reload();
}

//browser sync
function browser_sync() {
	browserSync.init({
    server: {
      baseDir: "./"
    }
	});
}

//files to be watched
var publicStyleWatch   = './_dev/css/**/*.css';
var publicScriptsWatch   = './_dev/js/**/*.js';
var htmlWatch   = './**/*.html';

//watch files and do things on change
function watch_files() {
	watch(publicStyleWatch, gulp.series(cssCompile, cssInject));
  watch(htmlWatch, reload);
  watch(publicScriptsWatch, gulp.series(jsCompile, reload));
}

//define the watch task
gulp.task('watch', gulp.parallel(browser_sync, watch_files));

// CREATE A PRODUCTION VERSION

gulp.task('build', gulp.series(clean, copy_files, minify_css, uglify_js));

function clean() {
  return del(['./dist/']);
}

function copy_files() {
  var pathsToCopy = [
    './**/*',
    '!./_dev/**',
    '!./node_modules/**',
    '!./.git/**',
    '!./gulpfile.js',
    '!./webpack.config.js',
    '!./webpack.production.config.js',
    '!./package.json',
    '!./package-lock.json',
    '!./.gitignore',
    '!./css/app.css',
    '!./js/app.js',
  ]

  return gulp.src(pathsToCopy) //source
  .pipe(gulp.dest('./dist/')); //save to destination
}

function minify_css() {
  return gulp.src('./css/app.css') //source
  .pipe(cleanCSS({compatibility: 'ie8', debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))
  .pipe(gulp.dest('./dist/css/')); //save to destination
}

function uglify_js(callback) {
  webpack(require('./webpack.production.config.js'), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }
    console.log(stats.toString());
    callback();
  });
}
