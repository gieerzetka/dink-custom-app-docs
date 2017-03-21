/// <binding BeforeBuild='build-spa' Clean='clean-spa' />

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var streamqueue = require('streamqueue');
var rename = require('gulp-rename');

var wwwRoot = './wwwroot';
var app = './app';

var relativePaths = {
    jsSource: '**/*.js',
    htmlSource: 'html/**/*.html'
};




var paths = {
    jsSource: app + '/' + relativePaths.jsSource,
    jsOutput: wwwRoot + '/scripts/',
    siteStyleSource: app + '/css/site.css',
    styleOutput: wwwRoot + '/css/',
    htmlSource: app + '/' + relativePaths.htmlSource,
    htmlOutput: wwwRoot + '/html/',
    fontsVendors: wwwRoot + '/fonts/',
    img: app + '/css/img/*.*',
    imgOutput: wwwRoot + '/css/img/',
    config: app + '/config.js'
}

gulp.task('vendor-setup', function (done) {
    gulp.src([
      'bower_components/bootstrap/fonts/glyphicons-halflings-regular.eot',
      'bower_components/bootstrap/fonts/glyphicons-halflings-regular.svg',
      'bower_components/bootstrap/fonts/glyphicons-halflings-regular.ttf',
      'bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff',
      'bower_components/bootstrap/fonts/glyphicons-halflings-regular.woff2',
    ]).pipe(gulp.dest(paths.fontsVendors));
});


gulp.task('copy-index', function (done) {
    gulp.src([
     app + '/index.html'
    ]).pipe(gulp.dest(wwwRoot));
});

gulp.task('copy-html', function (done) {
    return gulp.src([
     paths.htmlSource
    ]).pipe(gulp.dest(paths.htmlOutput));
});


gulp.task('bundle-styles', function (done) {
    return gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.css',
      'bower_components/glyphicons/styles/glyphicons.css',
      'bower_components/toastr/toastr.css',
      paths.siteStyleSource,
    ])
     .pipe(concat('style.css'))
     .pipe(gulp.dest(paths.styleOutput));
});

gulp.task('copy-img', function (done) {
    gulp.src([
     paths.img
    ]).pipe(gulp.dest(paths.imgOutput));
});


gulp.task('config', function (done) {
    gulp.src([paths.config])
        .pipe(rename('config.js'))
        .pipe(gulp.dest(paths.jsOutput));
});

gulp.task('bundle-scripts', function (done) {
    var scripts = gulp.src([
        //app + '/app.module.js',
        //app + '/app.router.js',
        //app + '/config.js',
        paths.jsSource
    ]);


    var libScripts = gulp.src([
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/angular-bootstrap/ui-bootstrap.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/toastr/toastr.js',
    ]);

    return streamqueue({ objectMode: true },
      libScripts.pipe(concat('lib.js')),
      scripts.pipe(concat('topMob.js'))
    )
      .pipe(concat('script.js'))
      .pipe(gulp.dest(paths.jsOutput));
});

gulp.task('copy-scripts', function (done) {
    gulp.src([
     app + '/app_dink.js'
    ]).pipe(gulp.dest(wwwRoot));
});

gulp.task('build-spa', ['vendor-setup', 'copy-index', 'copy-html', 'bundle-styles', 'copy-img', 'config', 'bundle-scripts', 'copy-scripts']);

gulp.task('clean-spa', function () {
    del('wwwroot/*');
});
