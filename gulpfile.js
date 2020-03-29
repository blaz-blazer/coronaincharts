const gulp = require('gulp');
const watch = require ('gulp-watch');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssvars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const cssImport = require('postcss-import');
const mixins = require('postcss-mixins');
const hexrgba = require('postcss-hexrgba');
const webpack = require ('webpack');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const rev = require('gulp-rev');
const revReplace = require("gulp-rev-replace");


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

gulp.task('build', gulp.series(clean, copy_files, minify_css, uglify_js, bust_css_cache, bust_js_cache, rewrite_css, rewrite_js));

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
    '!./LICENSE.md',
    '!./README.md',
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

function bust_css_cache() {
  return gulp.src('./dist/css/app.css')
    .pipe(rev())
    .pipe(gulp.dest('./dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/css'));
}

function bust_js_cache() {
  return gulp.src('./dist/js/app.js')
    .pipe(rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/js'));
}

function rewrite_css() {
  let manifest = gulp.src('./dist/css/rev-manifest.json');
  return gulp.src('./dist/index.html')
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest('./dist/'));
}

function rewrite_js() {
  let manifest = gulp.src('./dist/js/rev-manifest.json');
  return gulp.src('./dist/index.html')
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest('./dist/'));
}
