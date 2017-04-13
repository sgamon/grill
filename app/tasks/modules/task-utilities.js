'use strict';

let _ = require('lodash');
let fs  = require('fs');

/**
 * Helper methods used in task development.
 */
module.exports = {
  /**
   * Print help text and exit if needHelp is undefined.
   *
   * @param {string|undefined} needHelp
   * @param {string} text
   * @return {void}
   */
  printHelp(needHelp, text) {
    if (needHelp !== undefined) {
      text  = '\n' + _.compact(text.split('\n')).map((line) => '    ' + line.trim()).join('\n') + '\n';
      console.log(text);
      process.exit(1);
    }
  },

  /**
   * Print an error message and exit if the arg does not exist.
   *
   * @param {string|undefined} val arg value
   * @param {string} name arg name (ie, "-n")
   * @return {void}
   */
  errorOnMissingArg(val, name) {
    if (val === undefined) {
      let helpText = `ERROR: missing ${name} argument`;
      this.printHelp(true, helpText);
    }
  },

  /**
   * Print an error message and exit if the file already exists.
   *
   * @param {string} path
   * @return {void}
   */
  errorOnFileExists(path) {
    if (fs.existsSync(path)) {
      let helpText = `ERROR: ${path} already exists`;
      this.printHelp(true, helpText);
    }
  }

};
