var gulp = require('gulp');
var fs = require('fs');
var taskListing = require('gulp-task-listing');

gulp.task('list', taskListing); // show list of available gulp tasks

gulp.task('env', function() { // generate env.js
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log(`
      gulp env -
      creates config/env.js
    `);
    return;
  }

  var env = fs.readFileSync('./config/env/env.js.sample', 'utf8');
  fs.writeFileSync('./config/env/env.js', env);
});

