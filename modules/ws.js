'use strict';

/*
 Inspects the contents of each folder in ws. If a package.json file is
 found, it will be parsed. Metadata from the package.json file will be used to
 build the service catalog.

 The file system is also searched for "*-swagger.js" spec files.

 Returns an object that is a catalog of swagger web services, with a method to
 install them.
 */


let _ = require('lodash');
let config = require('../config');
let fs = require('fs');
let express = require('express');
let path = require('path');
let recurse = require('recursive-readdir-sync');
let swagger = require('swagger-node-express');

let host = 'http://' + (config.host || 'localhost') + ':' + config.port;
let swaggerui = express.static(path.normalize(__dirname + '/ws/swagger-ui'));
let wsFolder = path.join(config.root, './ws');




let services = recurse(wsFolder)
  .filter(function(file){
    return (path.basename(file) == 'package.json');
  })
  .map(function(packageFile){
    let json = JSON.parse(fs.readFileSync(packageFile, 'utf8'));

    if (!json.files) { // guard against rogue package.json files
      return '';
    }

    let routes = recurse(path.dirname(packageFile))
      .filter((fname) => fname.endsWith('-swagger.js'))
      .concat(json.files.map((fname) => path.join(path.dirname(packageFile), fname)))
    ;

    return {
      name: json.name,
      link: json.description,
      routes: _(routes).uniq().compact().value()
    };
  })
;


let ws = {
  services: _.compact(services),

  links() {
    return this.services.map((service) => {
      return `<a href="/up/ws/${service.name}"><button type="button">${service.link}</button></a>`;
    }).join('&nbsp; ');
  },

  install(swaggerui, wsApp) {
    this.services.forEach((service) => {
      let swaggerApp = express();
      let swaggerService = swagger.createNew(swaggerApp);

      swaggerApp.use((req, res, next) => {
        swaggerService.configure(`${host}/up/ws/${service.name}`, '1.0.0');
        swaggerui(req, res, next);
      });

      swaggerService.setApiInfo({ title: service.link, description: ws.links() });
      swaggerService.configureSwaggerPaths('', 'api-docs', '');
      swaggerService.configure(`${host}/ws/${service.name}`, '1.0.0');

      service.routes.forEach((route) => {
        require(route).installRoutes(swaggerService);
      });

      wsApp.use(`/${service.name}`, swaggerApp);
    });
  }

};


module.exports = ws;
