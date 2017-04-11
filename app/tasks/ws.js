'use strict';

let config = require('../../config');
let fs = require('fs');
let path = require('path');
let task = require('./modules/task-utilities');


/**
 * Generate env.js
 */
module.exports = function() {
  let argv =   require('minimist')(process.argv.slice(2)); // https://www.npmjs.org/package/minimist

  task.printHelp(argv.h, `
    gulp ws -n [name] [-d [description]]
    creates web service folder: /ws/[name]
  `);

  task.errorOnMissingArg(argv.n, '-n');

  let name = argv.n;
  let folder = path.join(config.root, 'ws', name);

  task.errorOnFileExists(folder);

  let packageJson = `
{
  "name": "${name}",
  "version": "1.0.0",
  "description": "${argv.d || name}",
  "files": [],
  "keywords": []
}
`;
  let swaggerSpec = ``;
  let webService = ``;

  fs.mkdirSync(folder);
  fs.writeFileSync(path.join(folder, 'package.json'), packageJson);
  fs.writeFileSync(path.join(folder, `${name}-swagger.js`), swaggerSpec);
  fs.writeFileSync(path.join(folder, `${name}-service.js`), webService);

  console.log(`New folder ready: ${folder}`);
};

