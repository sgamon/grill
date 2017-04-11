'use strict';

let express = require('express');

let bodyParser = require('body-parser');
let compression = require('compression');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let csrf = require('csurf');
let errorHandler = require('errorhandler');
let logger = require('morgan');
let path = require('path');
let recursiveReadSync = require('recursive-readdir-sync');
let session = require('express-session');
let store = {
  FileStore: require('session-file-store')(session),
  MySQLStore: require('express-mysql-session')(session)
};
let swagger = require('swagger-node-express');
let uuid = require('uuid');
let ws = require('./modules/ws');

// Application Config
let config = require('./config');
let host = 'http://' + (config.host || 'localhost') + ':' + config.port;
let log = require('./modules/logger')(config.log.error);
process.env.NODE_ENV = (process.argv[2]) ? process.argv[2] : config.env;

let app = express();
process.app = app;
app.set('port', process.env.PORT || config.port);
app.disable('x-powered-by');

// setup template system
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'html');

require('lodash-express')(app, 'html');
app.engine('jsx', require('express-react-views').createEngine());

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
//   Install swagger routes
let swaggerui = express.static(path.normalize(__dirname + '/ws/swagger-ui'));
swagger = swagger.createNew(app);

let wsApp = express()
  .use(function (req, res, next) {
    wsSwagger.configure('http://' + req.headers.host, '1.0.0');
    swaggerui(req, res, next);
  })
;

let wsSwagger = swagger.createNew(wsApp);
wsSwagger.configureSwaggerPaths('', 'api-docs', '');
wsSwagger.configure(host + '/up/ws', '1.0.0');
wsSwagger.setApiInfo({ title: 'UP Web Services', description: ws.links() });



ws.install(swaggerui, wsApp); // autowire ws routes
app.use('/ws', wsApp); // /ws is the root of all web services
//   /Install swagger routes


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
  res.type('text/plain').status(500).send(err.message);
});



let boot = function() {
  app.listen(app.get('port'), function(){
    console.info(`Express server listening at ${host}`);
  }).on('connection', function (socket) {
    socket.setTimeout(600 * 1000); // for longer running web services
  });
};

let shutdown = function() {
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

