var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var sass            = require('gulp-sass')(require('sass'));
var browserify      = require('browserify');
var through2        = require('through2');
var del             = require('del');
var jpegoptim       = require('imagemin-jpegoptim');

var $ = gulpLoadPlugins();

var DOMAIN = 'https://1020.photo';
var PATHS = {
  src:  './assets',
  dest: './static/assets',
  publishdir: './docs',
};

var AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'ie >= 11',
  'android >= 4'
];

// -----------------------------------------------------------------------------
// Stylesheet
gulp.task('sass', function() {
  return gulp.src(PATHS.src + '/**/*.scss')
    .pipe($.plumber())
    .pipe(sass({
      bundleExec: true,
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(PATHS.dest));
});

gulp.task('minify:css', function() {
  return gulp.src(PATHS.dest + '/**/*.css')
    .pipe($.plumber())
    .pipe($.cleanCss())
    .pipe(gulp.dest(PATHS.dest));
});

// -----------------------------------------------------------------------------
// JavaScript
gulp.task('browserify', function() {
  return gulp.src(PATHS.src + '/scripts/*.js')
    .pipe($.plumber())
    .pipe(through2.obj(function(file, encode, callback) {
      browserify(file.path)
        .bundle(function(err, res){
          file.contents = res;
          callback(null, file);
        });
    }))
    .pipe(gulp.dest(PATHS.dest + '/scripts'));
});

gulp.task('minify:js', function() {
  return gulp.src(PATHS.dest + '/scripts/*.js')
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe(gulp.dest(PATHS.dest + '/scripts'));
});

// -----------------------------------------------------------------------------
// HTML
gulp.task('minify:html', function() {
 return gulp.src(PATHS.publishdir + '/**/*.html')
   .pipe($.htmlmin({ collapseWhitespace: true }))
   .pipe(gulp.dest(PATHS.publishdir));
});

gulp.task('replace:html', function () {
  return gulp.src([PATHS.publishdir + '/**/*.html'])
    .pipe($.replace('<p></p>', ''))
    .pipe($.replace('<p><section', '<section'))
    .pipe($.replace('</section></p>', '</section>'))
    .pipe(gulp.dest(PATHS.publishdir));
});

gulp.task('format:html',
  gulp.series(
    'replace:html',
    'minify:html'
  )
);

// -----------------------------------------------------------------------------
// RSS
gulp.task('replace:rss', function() {
  return gulp.src(PATHS.publishdir + '/index.xml')
    .pipe($.replace('class="Lazy" src="/assets/images/eyecatch.png" ', ''))
    .pipe($.replace('data-original="/assets/images/', 'src="' + DOMAIN + '/assets/images/'))
    .pipe(gulp.dest(PATHS.publishdir));
});

gulp.task('copy:rss', function() {
  return gulp.src(PATHS.publishdir + '/index.xml')
    .pipe($.rename('feed.rss'))
    .pipe(gulp.dest(PATHS.publishdir));
});

gulp.task('format:rss',
  gulp.series(
    'replace:rss',
    'copy:rss'
  )
);

// -----------------------------------------------------------------------------
// Images
gulp.task('minify:images', function() {
  return gulp.src([PATHS.src + '/images/**/*', '!' + PATHS.src + '/images/posts/**/*'])
    .pipe($.imagemin())
    .pipe(gulp.dest(PATHS.dest + '/images'));
});
gulp.task('minify:images:jpegoptim', function() {
  return gulp.src(PATHS.src + '/images/posts/**/*')
    .pipe($.imagemin(function() {
      jpegoptim({
        stripIptc: false
      })
    }))
    .pipe(gulp.dest(PATHS.dest + '/images/posts'));
});

// -----------------------------------------------------------------------------
// Utility
gulp.task('copy:js', function() {
  return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jquery_lazyload/jquery.lazyload.min.js',
      'node_modules/three/build/three.min.js'
    ])
    .pipe(gulp.dest(PATHS.dest + '/scripts/vendor'));
});

gulp.task('copy:fonts', function() {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest(PATHS.dest + '/webfonts'));
});

gulp.task('clean', function(done) {
  del([PATHS.publishdir + '/**/index.xml', '!' + PATHS.publishdir + '/index.xml']);
  done();
});

// -----------------------------------------------------------------------------
// Initialize & Build
gulp.task('init',
  gulp.series(
    'copy:js',
    'copy:fonts'
  )
);

gulp.task('build',
  gulp.series(
    'sass',
    'browserify',
    gulp.parallel(
      'minify:css',
      'minify:js',
      'minify:images',
      'minify:images:jpegoptim'
    )
  )
);
