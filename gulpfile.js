var gulp = require('gulp');
var beautify = require('gulp-js-beautify');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var filelog = require("gulp-filelog");
var fs = require('fs');
var order = require("gulp-order");
var taskListing = require('gulp-task-listing');


var beautifyOpts = JSON.parse(fs.readFileSync('../.jsbeautifyrc', 'utf8'));

var jsPaths = ['app/**/*.js'];

var bundleFiles = [
  'public/js/chaldron.js'
]; // bundle these files together



gulp.task('list', taskListing); // show list of available gulp tasks

/**
 * Create the shell of a new app.
 *
 * gulp app -n <app-name>
 *
 * <app-name> must be one word, all lowercase, with dash word separators. Ex: my-new-thing
 */
gulp.task('app', function() {
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp app -\n Create the shell of a new app.  \n');
    console.log('gulp app -n[ame] <app-name>  \n');
    console.log('<app-name> must be one word, all lowercase, with dash word separators. Ex: my-new-thing  \n');
    return;
  }

  var createApp = require('./app/_create/modules/createApp.js');
  createApp(argv);
}); // create a new app


/**
 * Create the shell of a new ajax module.
 *
 * gulp app -a <app-name> -n <module-name> -m <method>
 *
 * Ex: gulp app -a company-management -n saveCompany -m POST
 */
gulp.task('ajax-module', function() {
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp ajax-module -\n Create the shell of a new ajax module  \n');
    console.log('gulp app -a <app-name> -n <module-name> -m <method>  \n');
    console.log('Ex: gulp ajax-module -a company-management -n saveCompany -m POST \n');
    return;
  }

  var createAjaxModule = require('./app/_create/modules/createAjaxModule.js');
  createAjaxModule(argv);
}); // create a new ajax module


/**
 * Create the shell of a new component.
 *
 * gulp component -n <component-name>
 *
 * <component-name> must be one word, all lowercase, with dash word separators. Ex: my-new-thing
 */
gulp.task('component', function() {
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp component -\n Create the shell of a new component.  \n');
    console.log('gulp component -n <component-name>  \n');
    console.log('<component-name> must be one word, all lowercase, with dash word separators. Ex: my-new-thing  \n');
    return;
  }

  var createComponent = require('./app/components/_create/modules/createComponent.js');
  createComponent(argv);
}); // create a new component


/**
 * (Re-)generate jsdoc for a component.
 *
 * gulp component-doc -n <component-name>
 *
 * <component-name> must be one word, all lowercase, with dash word separators. Ex: my-new-thing
 */
gulp.task('component-doc', function() {
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp component-doc -\n (Re-)generate jsdoc for a component.  \n');
    console.log('gulp component-doc -n <component-name>  \n');
    console.log('<component-name> must be one word, all lowercase, with dash word separators. Ex: my-new-thing  \n');
    return;
  }

  var generateJsdoc = require('./app/components/_create/modules/generateJsdoc.js');
  generateJsdoc(argv);
}); // create a new component


gulp.task('beautify', function() {
  gulp.src(jsPaths, {base: './'})
    .pipe(beautify(beautifyOpts))
    .pipe(gulp.dest('./'));
}); // format js files using js-beautify


gulp.task('lint', function() {
  gulp.src(jsPaths, {base: './'})
    .pipe(beautify(beautifyOpts))
    .pipe(eslint()) // see .eslintrc for settings
    .pipe(eslint.format())
    .pipe(gulp.dest('./'));
}); // format js files using js-beautify, lint the files, report lint errors


gulp.task('libs', function(){
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp libs -\n concatenate all js files and create public/js/libs.js  \n');
    return;
  }

  var _ = require('lodash');

  var config = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8'));
  var opts = {};
  if (config.directory) {
    opts.dir = config.directory;
  }
  var bowerFiles = require('bower-files')(opts).js; // array of js filenames from bower_components

  _.remove(bowerFiles, function(path){ // remove some files from the list
    if (path.indexOf('underscore') > -1) { // we use lodash, so we don't need this
      return true;
    }
    if (path.indexOf('requirejs') > -1) { // throws errors - pitch it out for now
      return true;
    }
    if (path.indexOf('pnotify') > -1) { // throws errors - pitch it out for now
      return true;
    }
    if (path.indexOf('jQuery') > -1) { // this is a dependency of something else, we use lowercase jquery
      return true;
    }
    if (path.indexOf('esprima') > -1) { // only used for dev
      return true;
    }
    if (path.indexOf('tap') > -1) { // bundled in png.js
      return true;
    }

    return false;
  });


  // pick out some favorites for special treatment
  var bootstrap = _.remove(bowerFiles, function(path){ return (path.indexOf('/bootstrap/') > -1) ? true : false; });
  var jquery = _.remove(bowerFiles, function(path){ return (path.indexOf('/jquery/') > -1) ? true : false; });
  var lodash = _.remove(bowerFiles, function(path){ return (path.indexOf('/lodash/') > -1) ? true : false; });

  // order is significant, so arrange it here
  var jsFiles = [].concat(lodash, jquery, bootstrap, bowerFiles, [
    'public/js/bootstrap3-editable-1.5.0.min.js',
    'public/js/bootstrap-pnotify/bootstrap-pnotify.js',
    'public/js/png.js',
    'public/js/floatlabel.js'
  ]).map(function(path){
    return path.replace(/^.*\/public/g, 'public');
  });

  // console.dir(jsFiles);

  // build a header comment that lists the concatenated files, in order
  var header = '/*\n' + jsFiles.join('\n') + '\n*/\n\n';

  var libs = 'public/js/libs.js'; // the roll-up file

  // create libs.js
  fs.writeFileSync(libs, header);
  jsFiles.forEach(function(path){
    var data = fs.readFileSync(path);
    fs.appendFileSync(libs, data);
  });

}); // rebuild the libs.js file, a roll-up of most bower files, plus our own libs


gulp.task('selenium', function(){
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp selenium -\n run all selenium test \n');
    return;
  }

  var runTests = require('./test/selenium/modules/runTests.js');
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  argv.path = __dirname;

  runTests(argv);
}); // selenium test runner

gulp.task('png', function() { // (re-)generate bundle.js
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp png -\n (re-)generate /public/js/png.js \n');
    return;
  }

  var browserify = require('browserify');
  var b = browserify();
  b.add('./public/js/png-build.js');
  b.bundle(function(err, src){
    fs.writeFileSync('./public/js/png.js', src);
    console.log(fs.statSync('./public/js/png.js').size + ' bytes');
  });
});

gulp.task('env', function() { // generate env.js
  var argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log('\n gulp env -\n creates config/env.js \n');
    return;
  }

  var env = fs.readFileSync('./config/env/env.js.sample', 'utf8');
  fs.writeFileSync('./config/env/env.js', env);
});

