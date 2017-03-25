gulp    = require 'gulp'
coffee  = require 'gulp-coffee'
gutil   = require 'gulp-util'

gulp.task 'coffee', () ->
    gulp.src 'src/**/*.coffee'
        .pipe coffee bare: true
        .pipe gulp.dest '.'
        .on 'error', gutil.log

gulp.task 'default', ['coffee']