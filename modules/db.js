//
// Database Query Module
//


var log = require('./logger')('errors.json');
var db = require('mysql').createPool(require('../config').db);

require('bluebird').promisifyAll(require("mysql/lib/Pool").prototype);

function logError(e) {
  log.error(e);
  e.logged = true;
  throw e;
}

function getMySQLResults(results, columnInfo) {
  return results;
}

/**
 * query functions
 *
 * These functions query known databases, returning a promise that will be
 * resolved or rejected.  See: https://promisesaplus.com/
 * The caller provides the queryTemplate with standard tokens ? and ??
 * See: https://github.com/felixge/node-mysql#preparing-queries
 * The caller provides parameters as extra arguments to this function.
 * The query functions will log database connection/query errors.
 * The caller is responsible for providing the success / failure handlers
 * using the 'done' or 'then' methods of the promise.  Documentation at:
 * https://github.com/petkaantonov/bluebird/blob/master/API.md
 *
 */
function queryDB(queryTemplate) {
  var parameters = Array.prototype.slice.call(arguments, 1);
  var promise = db.queryAsync(queryTemplate, parameters);
  return promise.spread(getMySQLResults).catch(logError);
}

//
// public interface
//

module.exports.query = queryDB;
