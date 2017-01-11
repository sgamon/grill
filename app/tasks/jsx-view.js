'use strict';

let fs = require('fs');
let _ = require('lodash');
let task = require('./modules/task-utilities');

/**
 * Create a new jsx view file.
 */
module.exports = function() {
  let argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist

  task.printHelp(argv.h, `
    gulp jsx-view -n [name] -
    creates a new jsx view file
  `);

  task.errorOnMissingArg(argv.n, 'name');

  let name = _.camelCase(argv.n.replace(/\.js$/, ''));
  let className = _.upperFirst(name);
  let filename = `./app/views/${_.kebabCase(name)}.jsx`;

  task.errorOnFileExists(filename);

  let code = `var React = require('react');

class ${className} extends React.Component {
  render() {
    var props = this.props; 
    return <div>This is jsx! {props.title}</div>;
  }
}

module.exports = ${className};
`;

  fs.writeFileSync(filename, code);
};

