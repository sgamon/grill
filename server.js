'use strict';

var express = require('express');
var path = require('path');
var compression = require('compression');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var store = {
  FileStore: require('session-file-store')(session),
  MySQLStore: require('express-mysql-session')(session)
};
var csrf = require('csurf');
var cors = require('cors');
var errorHandler = require('errorhandler');
var uuid = require('uuid');
var recursiveReadSync = require('recursive-readdir-sync');

// Application Config
var config = require('./config');
var log = require('./modules/logger')(config.log.error);
process.env.NODE_ENV = (process.argv[2]) ? process.argv[2] : config.env;

var app = express();
process.app = app;
app.set('port', process.env.PORT || config.port);
app.disable('x-powered-by');

// setup template system
require('lodash-express')(app, 'html');
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'app', 'views'));

// middleware - order is significant!
app.use(compression());
app.use(logger('common'));
app.use(bodyParser.json({strict: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  genid: function(req) {
    return uuid.v4(); // use UUIDs for session IDs
  },
  store: new store[config.session.store.type](config.session.store.options),
  secret: config.session.secret
}));
app.use(csrf());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler());

//var favicon = require('serve-favicon');
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// error handling
switch(app.get('env')) {
  case 'production':
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
    break;
  case 'development':
  default:
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
    break;
}


//////////////////////////////////////////////////////////////////////////////
// Load all paths from app/controllers. See app/controllers/README.md
//
recursiveReadSync(path.join(__dirname, 'app', 'controllers'))
  .filter((fname) => fname.endsWith('Controller.js'))
  .forEach((fname) => require(fname))
;


//////////////////////////////////////////////////////////////////////////////
// Error handlers terminate the middleware chain
//
app.use(function (req, res, next) {
  res.status(404).render(404); // nothing to do, nowhere to go, ...
});

app.use(function (err, req, res, next) {
  log.error(err);
  res.type('text/plain').send(500, err.message);
});



var boot = function() {
  app.listen(app.get('port'), function(){
    console.info('Express server listening on port ' + app.get('port'));
  }).on('connection', function (socket) {
    socket.setTimeout(600 * 1000); // for longer running web services
  });
};

var shutdown = function() {
  app.close();
};


if (require.main === module) { // script run directly
  boot();
} else { // loaded as a module
  module.exports = {
    boot: boot,
    shutdown: shutdown,
    port: app.get('port')
  };
}

