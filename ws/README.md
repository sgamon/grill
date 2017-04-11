# Web Services

We build our web services using [swagger](https://www.npmjs.com/package/swagger-node-express).


## Installing web services

_**Do not edit `server.js`.**_

Web services are auto-installed by a process that reads metadata from 
`package.json` files, and reads the file system for "*-swagger.js" spec files.

If you are curious about how this works, see:

    /modules/ws.js
    

## Creating a new web service

Related services are grouped in folders inside the `/ws` folder. If your new 
service "fits" an existing folder, go ahead and add on. 

### gulp generator

If you need to create a new folder, it's best to use the gulp generator:

    gulp ws -n [name] [-d "[description]"]
    
This will create the folder and files in one go:
 
    /ws/[name]
    package.json
    [name]-swagger.js
    [name]-service.js
    
    
## package.json

If you create a new folder, add a package.json file to it. Refer to the existing 
folders for examples.  

The package.json file is used by `/modules/ws.js` to actually install the web
services. Three properties are used:

* name - the subpath for your web services (ie, "idm" installs as "/up/ws/idm/")
* description - button text for the swagger tabs
* files - optional array of spec files, relative to package.json. 

You only need to explicitly list a spec file if it is outside the current folder.
For example, the idm service borrows from the `headerTools` folder. Any spec 
files in the current folder (or subfolders) will be automatically discovered by
the installer.

## spec files (ie, *-swagger.js)

You describe (and document) your service using a swagger spec document. This is
a json format. See existing files for examples. You can have multiple specs in
a single file, so go ahead and crowd into an existing document if it makes 
sense. Otherwise, just create a new document.

Spec doc filenames must all end with "-swagger.js". Ex:

    idm-swagger.js
    
## service files

The nodejs code to implement each service is in a service file. Same rules 
apply: 

* Multiple services per file
* Crowd in if it makes sense
* If you create a new file, the name must end with "-service.js"

Ex:

    user-service.js
    

    

