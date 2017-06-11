'use strict';

import 'babel-polyfill';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import fs from 'fs-extra-promise';
import path from 'path';
import mergeStream from 'merge-stream';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();
const autoprefixerBrowsers = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('default', ['clean'], (cb) => {
  return runSequence([
    'vulcanize',
    'styles',
    'images',
    'html',
    'scripts',
    'copy'
  ]);
});

gulp.task('babel', (cb) => {
  gulp.src([
    './app/core/**/*.{js,html}',
    '!./app/core/bower_components/**/*'
  ]).pipe($.if('*.html', $.crisper({
    scriptInHead: false
  })))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.js', $.babel({
      presets: [
        'es2015',
        'stage-2'
      ]
    })))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./.tmp/core/'))
    .on('end', () => {
      fs.symlinkAsync(
        path.resolve('./app/core/bower_components/'),
        path.resolve('./.tmp/core/bower_components'),
        'dir'
      ).then(() => {
        cb();
      }).catch((err) => {
        cb();
      });
    });
});

gulp.task('vulcanize', ['babel'], (cb) => {
  gulp.src('./.tmp/core/elements.html')
    .pipe($.vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe($.crisper({
      alwaysWriteScript: true
    }))
    .pipe($.if('*.js', $.uglify({
      beautify: false
    })))
    .pipe($.if('*.html', $.htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      removeComments: true,
      removeAttributeQuotes: true
    })))
    .pipe(gulp.dest('./dist/core/'))
    .on('end', () => {
      gulp.src('./.tmp', { read: false })
        .pipe($.clean())
        .on('end', cb);
    });
});

gulp.task('styles', (cb) => {
  gulp.src('./app/core/styles/**/*.css')
    .pipe($.autoprefixer(autoprefixerBrowsers))
    .pipe($.cleanCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/core/styles/'))
    .on('end', cb);
});

gulp.task('images', (cb) => {
  gulp.src('./app/content/assets/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist/content/assets/'))
    .on('end', cb);
});

gulp.task('html', (cb) => {
  gulp.src('./app/*.html')
    .pipe($.htmlmin({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      removeComments: true,
      removeAttributeQuotes: true
    }))
    .pipe(gulp.dest('./dist/'))
    .on('end', cb);
});

gulp.task('scripts', (cb) => {
  gulp.src('./app/core/bower_components/webcomponentsjs/webcomponents-lite.js')
    .pipe($.uglify({
      beautify: false
    }))
    .pipe(gulp.dest('./dist/core/bower_components/webcomponentsjs/'))
    .on('end', cb);
});

gulp.task('copy', (cb) => {
  const root = gulp.src([
    './app/**/*.{txt,ico,json}',
    '!./app/core/bower_components/**/*',
    '!./app/content/**/*'
  ]).pipe(gulp.dest('./dist/'));
  const content = gulp.src([
    './app/content/**/*',
    '!./app/content/assets/**/*'
  ]).pipe(gulp.dest('./dist/content/'));
  return mergeStream(root, content);
});

gulp.task('clean', (cb) => {
  return gulp.src([
    './dist',
    './.tmp'
  ], { read: false })
    .pipe($.clean());
});
