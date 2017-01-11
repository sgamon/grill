let gulp = require('gulp');
let fs = require('fs');
let path = require('path');

let taskListing = require('gulp-task-listing');

gulp.task('list', taskListing); // show list of available gulp tasks

// -----------------------------------------------------------------------------
// Load Gulp Tasks
// -----------------------------------------------------------------------------
fs.readdirSync('./app/tasks').forEach(function(taskname){
  if (!taskname.match(/\.js$/)) {
    return;
  }

  let stat = fs.lstatSync(path.join('./app/tasks', path.parse(taskname).base));
  if (stat.isDirectory()) {
    return;
  }

  taskname = taskname.replace(/.js$/, '');
  let task = require('./app/tasks/' + taskname);
  gulp.task(taskname, task);
});
