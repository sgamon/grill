'use strict';

let fs = require('fs');
let _ = require('lodash');


/**
 * Create a new jsx view file.
 */
module.exports = function() {
  let argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist
  if (argv.h !== undefined) {
    console.log(`
      gulp jsx-view -n [name] -
      creates a new jsx view file
    `);
    return;
  }

  if (!argv.n) {
    console.log(`
      ERROR: missing name
    `);
    return;
  }

  let name = _.camelCase(argv.n.replace(/\.js$/, ''));
  let className = _.upperFirst(name);
  let filename = `./app/views/${_.kebabCase(name)}.jsx`;

  if (fs.existsSync(filename)) {
    console.log(`
      ERROR: ${filename} already exists
    `);
    return;
  }

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

