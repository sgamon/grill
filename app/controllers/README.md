Unlike a typical Express, Grill sets routes in the controller files themselves. 
This way, you only have to edit a single file to create a new path.

All controllers are automatically loaded and run at server start. 

All controller filenames _must_ end with `Controller.js`. Example:

    homeController.js
    
These specially named files are the ones that are auto-loaded. You may add 
supporting files to the controllers folder - they will not be auto-loaded. You 
may create subfolders to any level. Any file in the tree that follows the naming
convention will be auto-loaded.

A reference to the Grill instance is stored in `process.app`, so you can use 
that to set a route from inside your controller.

Example controller code:

    'use strict';
    
    process.app.get('/', renderHomePage);
    
    function renderHomePage(req, res) {
      res.render('default', {title: 'Default Page'});
    }

A controller file can set any number of paths. Take care to not set the same 
path in multiple files. 
