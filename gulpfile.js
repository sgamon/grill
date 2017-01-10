var gulp = require('gulp');
var fs = require('fs');
var taskListing = require('gulp-task-listing');

gulp.task('list', taskListing); // show list of available gulp tasks

// -----------------------------------------------------------------------------
// Load Gulp Tasks
// -----------------------------------------------------------------------------
fs.readdirSync('./app/tasks').forEach(function(taskname){
  if (taskname == 'README.md') {
    return;
  }

  taskname = taskname.replace(/.js$/, '');
  var task = require('./app/tasks/' + taskname);
  gulp.task(taskname, task);
});
