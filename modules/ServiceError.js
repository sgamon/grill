'use strict';

/**
 * Creates an error object with a text property "msg".
 *
 * @param {string} message text set to the msg property
 * @constructor
 */
function ServiceError(message) {
  this.msg = message || '';
}
ServiceError.prototype = Object.create(Error.prototype);
ServiceError.prototype.constructor = ServiceError;


module.exports = ServiceError;

