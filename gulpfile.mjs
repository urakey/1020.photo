import gulp from 'gulp'
import { deleteAsync } from 'del'
import browserify from 'browserify'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import dartSass from 'gulp-dart-sass'
import htmlmin from 'gulp-htmlmin'
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import rename from 'gulp-rename'
import replace from 'gulp-replace'
import uglify from 'gulp-uglify'
import jpegoptim from 'imagemin-jpegoptim'
import through2 from 'through2'

const DOMAIN = 'https://1020.photo';
const PATHS = {
  src:  './assets',
  dest: './static/assets',
  publishdir: './docs',
};

const AUTOPREFIXER_BROWSERS = [
  'last 2 versions',
  'ie >= 11',
  'android >= 4'
];

// -----------------------------------------------------------------------------
// Stylesheet
export function buildCss() {
  return gulp.src(PATHS.src + '/**/*.scss')
    .pipe(plumber())
    .pipe(dartSass({
      bundleExec: true,
      errLogToConsole: true,
      outputStyle: 'expanded'
    }))
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest(PATHS.dest));
}

export function minifyCss() {
  return gulp.src(PATHS.dest + '/**/*.css')
    .pipe(plumber())
    .pipe(cleanCss())
    .pipe(gulp.dest(PATHS.dest));
}

// -----------------------------------------------------------------------------
// JavaScript
export function buildJs() {
  return gulp.src(PATHS.src + '/scripts/*.js')
    .pipe(plumber())
    .pipe(through2.obj(function(file, encode, callback) {
      browserify(file.path)
        .bundle(function(err, res){
          file.contents = res;
          callback(null, file);
        });
    }))
    .pipe(gulp.dest(PATHS.dest + '/scripts'));
}

export function minifyJs() {
  return gulp.src(PATHS.dest + '/scripts/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(PATHS.dest + '/scripts'));
}

// -----------------------------------------------------------------------------
// HTML
export function replaceHtml() {
  return gulp.src([PATHS.publishdir + '/**/*.html'])
    .pipe(replace('<p></p>', ''))
    .pipe(replace('<p><section', '<section'))
    .pipe(replace('</section></p>', '</section>'))
    .pipe(gulp.dest(PATHS.publishdir));
}

export function minifyHtml() {
  return gulp.src(PATHS.publishdir + '/**/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(PATHS.publishdir));
}

// -----------------------------------------------------------------------------
// RSS
export function replaceRss() {
  return gulp.src(PATHS.publishdir + '/index.xml')
    .pipe(replace('class="Lazy" src="/assets/images/eyecatch.png" ', ''))
    .pipe(replace('data-original="/assets/images/', 'src="' + DOMAIN + '/assets/images/'))
    .pipe(gulp.dest(PATHS.publishdir));
}

export function copyRss() {
  return gulp.src(PATHS.publishdir + '/index.xml')
    .pipe(rename('feed.rss'))
    .pipe(gulp.dest(PATHS.publishdir));
}

// -----------------------------------------------------------------------------
// Images
export function minifyImages() {
  return gulp.src([PATHS.src + '/images/**/*', '!' + PATHS.src + '/images/posts/**/*'])
    .pipe(imagemin())
    .pipe(gulp.dest(PATHS.dest + '/images'));
}

export function minifyImagesJpegoptim() {
  console.log(PATHS.src);

  return gulp.src(PATHS.src + '/images/posts/**/*')
    .pipe(imagemin(function() {
      jpegoptim({
        stripIptc: false
      })
    }))
    .pipe(gulp.dest(PATHS.dest + '/images/posts'));
}

// -----------------------------------------------------------------------------
// Utility
export function copyJs() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery_lazyload/jquery.lazyload.min.js',
    'node_modules/three/build/three.min.js'
  ])
  .pipe(gulp.dest(PATHS.dest + '/scripts/vendor'));
}

export function copyFonts() {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest(PATHS.dest + '/webfonts'));
}

export function clean(done) {
  deleteAsync([PATHS.publishdir + '/**/index.xml', '!' + PATHS.publishdir + '/index.xml']);
  done();
}
