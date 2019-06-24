var gulp 				= require('gulp'),
		less 				= require('gulp-less'),
		bs	 				= require('browser-sync').create(),
		mini 				= require('gulp-clean-css'),
		pref 				= require('gulp-autoprefixer'),
		minjs				= require('gulp-uglifyjs'),
		del 				= require('del'),
		cache				= require('gulp-cache'),
		image				= require('gulp-imagemin'),
		png					= require('imagemin-pngquant'),
		imgMoz 				= require('imagemin-mozjpeg');

gulp.task('less', function() {
	return gulp.src('app/less/style.less')
	.pipe(less())
	.pipe(pref({browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'], cascade: true}))
	.pipe(mini())
	.pipe(gulp.dest('app/css'))
	.pipe(bs.stream());
});
gulp.task('js', function(){
	return gulp.src('app/js/**/*.js')
	.pipe(minjs())
	.pipe(gulp.dest('dist/js'));
});
gulp.task('serv', gulp.series('less', function() {
	bs.init({
		server: {
			baseDir: "./app"
		},
		notify: false,
		https: false
	});
	gulp.watch('app/less/**/*.less', gulp.parallel('less'));
	gulp.watch('app/*.html').on('change', bs.reload);
	gulp.watch('app/js/script.js').on('change', bs.reload);
}));
gulp.task('watch', function() {
	gulp.watch('app/less/**/*.less', gulp.parallel('less'));
});
gulp.task('clean', async function() {
	return del.sync('dist');
});
gulp.task('clear', function (callback) {
	return cache.clearAll();
});
gulp.task('build', async function() {
  gulp.series('js');
	var imageCompress = gulp.src('app/img/**/*')
		.pipe(cache(image([imgMoz({
				quality: 85
			})])))
		.pipe(gulp.dest('dist/img'));
	var fonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
	var css = gulp.src('app/css/**/*')
		.pipe(gulp.dest('dist/css'));
	var html = gulp.src('app/*.html')
	  .pipe(gulp.dest('dist'));
});

exports.build = gulp.parallel('clean', 'build');
exports.default = gulp.series('serv');