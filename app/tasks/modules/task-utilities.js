'use strict';

let fs = require('fs');

/**
 * Helper methods used in task development.
 */
module.exports = {
  /**
   * Print help text and exit if needHelp is undefined.
   *
   * @param {string|undefined} needHelp
   * @param {string} helpText
   * @return {void}
   */
  printHelp: function(needHelp, helpText) {
    if (needHelp !== undefined) { // ie, -h flag is present
      console.log(helpText);
      process.exit();
    }
  },

  /**
   * Print an error message and exit if the arg does not exist.
   *
   * @param {string|undefined} arg value
   * @param {string} argName
   * @return {void}
   */
  errorOnMissingArg: function(arg, argName) {
    if (!arg) {
      console.log(`
        ERROR: missing ${argName}
      `);
      process.exit(1);
    }
  },

  /**
   * Print an error message and exit if the file already exists.
   *
   * @param {string} filename path
   * @return {void}
   */
  errorOnFileExists: function(filename) {
    if (fs.existsSync(filename)) {
      console.log(`
        ERROR: ${filename} already exists
      `);
      process.exit(1);
    }
  }
};
