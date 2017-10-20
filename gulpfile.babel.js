'use strict';

import browserSync from 'browser-sync';
import fs from 'fs-extra-promise';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import historyApiFallback from 'connect-history-api-fallback';
import path from 'path';
import runSequence from 'run-sequence';
import { reload } from 'browser-sync';

const $ = gulpLoadPlugins();
let NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';
NODE_ENV = process.argv.includes('--dev') ? 'development' : NODE_ENV;
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

gulp.task('default', ['clean'], () => {
  return new Promise((resolve, reject) => {
    runSequence([
      'vulcanize',
      'styles',
      'images',
      'html',
      'scripts',
      'copy'
    ], resolve);
  });
});

gulp.task('babel', () => {
  return new Promise((resolve, reject) => {
    gulp.src([
      './app/core/**/*.{js,html}',
      '!./app/core/bower_components/**/*'
    ]).pipe($.if('*.html', $.crisper({
      scriptInHead: false
    })))
    /* .pipe($.if('*.js', $.eslint()))*/
    /* .pipe($.if('*.js', $.eslint.format()))*/
    /* .pipe($.if('*.js', $.eslint.failAfterError()))*/
      .pipe($.sourcemaps.init())
      .pipe($.if('*.js', $.babel({
        presets: [
          ['es2015', { modules: false }],
          'stage-2'
        ],
        plugins: ['babel-plugin-transform-async-to-generator']
      })))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('./.tmp/core/'))
      .on('end', () => {
        fs.symlinkAsync(
          path.resolve('./app/core/bower_components/'),
          path.resolve('./.tmp/core/bower_components'),
          'dir'
        ).then(() => {
          resolve();
        }).catch((err) => {
          resolve();
        });
      }).on('error', reject);
  });
});

gulp.task('vulcanize', ['babel'], () => {
  return new Promise((resolve, reject) => {
    gulp.src('./.tmp/core/elements.html')
      .pipe($.vulcanize({
        stripComments: true,
        inlineCss: true,
        inlineScripts: true
      }))
      .pipe($.crisper({
        alwaysWriteScript: true
      }))
      .pipe($.if('*.js', $.envify({ NODE_ENV })))
      .pipe($.if('*.js', $.replace('"development" !== \'production\'', 'false')))
      .pipe($.if('*.js', $.uglify().on('error', reject)))
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
          .pipe($.clean());
        resolve();
      }).on('error', reject);
  });
});

gulp.task('styles', () => {
  return new Promise((resolve, reject) => {
    gulp.src('./app/core/styles/**/*.css')
      .pipe($.autoprefixer(autoprefixerBrowsers))
      .pipe($.cleanCss({compatibility: 'ie8'}))
      .pipe(gulp.dest('./dist/core/styles/'))
      .on('end', resolve);
  });
});

gulp.task('images', () => {
  return new Promise((resolve, reject) => {
    gulp.src('./app/content/assets/**/*')
      .pipe($.imagemin({
        progressive: true,
        interlaced: true
      }))
      .pipe(gulp.dest('./dist/content/assets/'))
      .on('end', resolve).on('error', reject);
  });
});

gulp.task('html', () => {
  return new Promise((resolve, reject) => {
    gulp.src('./app/*.html')
      .pipe($.useref())
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
      .on('end', resolve).on('error', reject);
  });
});

gulp.task('scripts', () => {
  return new Promise((resolve, reject) => {
    gulp.src('./app/core/bower_components/webcomponentsjs/webcomponents-lite.js')
      .pipe($.uglify().on('error', reject))
      .pipe(gulp.dest('./dist/core/bower_components/webcomponentsjs/'))
      .on('end', resolve).on('error', reject);
  });
});

gulp.task('copy', () => {
  return new Promise((resolve, reject) => {
    gulp.src([
      './app/**/*.{txt,ico,json}',
      '!./app/core/bower_components/**/*',
      '!./app/content/**/*'
    ]).pipe(gulp.dest('./dist/'))
      .on('end', resolve).on('error', reject);
  }).then(() => {
    return new Promise((resolve, reject) => {
      gulp.src([
        './app/content/**/*',
        '!./app/content/assets/**/*'
      ]).pipe(gulp.dest('./dist/content/'))
        .on('end', resolve).on('error', reject);
    });
  });
});

gulp.task('clean', () => {
  return gulp.src([
    './dist',
    './.tmp',
    './.publish'
  ], { read: false })
    .pipe($.clean());
});

gulp.task('serve', ['babel'], () => {
  browserSync({
    port: 8081,
    notify: false,
    logPrefix: 'BD',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: (snippet) => {
          return snippet;
        }
      }
    },
    server: {
      baseDir: ['.tmp', 'app'],
      middleware: [historyApiFallback()]
    }
  });
  gulp.watch(['./app/core/**/*.{js,html}'], ['babel', reload]);
  gulp.watch(['./app/**/*'], reload);
});

gulp.task('demo', ['default'], () => {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages());
});

gulp.task('serve:dist', ['default'], () => {
  browserSync({
    port: 8081,
    notify: false,
    logPrefix: 'BD',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: (snippet) => {
          return snippet;
        }
      }
    },
    server: {
      baseDir: ['dist'],
      middleware: [historyApiFallback()]
    }
  });
});
