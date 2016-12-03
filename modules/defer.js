/*eslint-env node */

'use strict';

var Promise = require('bluebird');

/**
 * Returns a deferred promise object, implemented in bluebird.
 *
 * See: https://github.com/petkaantonov/bluebird/blob/master/API.md#deferred-migration
 *
 * @returns {{resolve: *, reject: *, promise: (bluebird|exports|module.exports)}}
 */
module.exports = function() {
  var resolve, reject;
  var promise = new Promise(function() {
    resolve = arguments[0];
    reject = arguments[1];
  });
  return {
    resolve: resolve,
    reject: reject,
    promise: promise
  };
};
