gulp    = require 'gulp'
coffee  = require 'gulp-coffee'
gutil   = require 'gulp-util'

gulp.task 'coffee', () ->
    gulp.src 'src/server/**/*.coffee'
        .pipe coffee bare: true
        .pipe gulp.dest '.'
        .on 'error', gutil.log
    gulp.src 'src/client/**/*.coffee'
        .pipe coffee bare: true
        .pipe gulp.dest './public/js/'
        .on 'error', gutil.log

gulp.task 'default', ['coffee']