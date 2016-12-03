'use strict';

var config = require('../config');
var bunyan = require('bunyan');

/**
 * Return a bunyan logger instance.
 * 
 * (
 * It is apparently a bad idea to allow multiple logger instances to rotate
 * the same log file. So we cache logger instances in process, by log file.
 * Ergo, there will only be one logger instance per logfile.
 * 
 * See: http://stackoverflow.com/questions/29165023/error-enoent-with-bunyan-rotating-file-logging-nodejs
 * )
 *
 * @param {string} logname
 *
 * @return {object} bunyan logger
 */
module.exports = function(logname) {
  var loggers = process.loggers || {};

  if (!loggers[logname]) {
    loggers[logname] = bunyan.createLogger({
      name: logname.replace(/\..*$/, ''), // strip tail
      streams: [
        {
          path: config.log.location + '/' + logname,
          type: 'rotating-file',
          period: '1d',
          count: 5,
          level: config.log.level
        }
      ]
    });

    process.loggers = loggers;

    showMessageOnDev('making ' + logname + ' logger');
  } else {
    showMessageOnDev('re-using cached ' + logname + ' logger');
  }

  return loggers[logname];
};

function showMessageOnDev(msg) {
  if (config.env == 'development') {
    console.log(msg);
  }
}
