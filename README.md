# Grill

Grill is an Express 4 instance, configured and ready to run.

Express 4 has a minimum of features. Finding all the middleware and configuring
it for routine web sites is left as an exercise for each developer. Grill is a 
_batteries-included_ version of Express 4. Sensible choices have been made for
you, so you can have a full-featured web server without all the fiddly stuff.

Grill is opinionated. Choices have been made for you. The choices include:

* MVC design for dynamic pages
* Underscore templates for dynamic views
* Swagger for Web Services
* Flyway for relational DB migrations
* Bunyan for logging


## Installation

To light your grill, open a shell and cd to the grill folder. Then:

    npm install -g gulp
    npm install
    gulp env

After the above setup, run this command to start the server:

    node server
    
    
## Configuration

Configuration setting for your site are stored in `config/env/env.js`.
Modify this file as needed.


## Static Files

Static files (ie, html, css, js, images, etc) are served from the 
`public` folder. For example, if you put an image called `logo.gif` 
in `public/img`, you could refer to that image in html as

    <img src="/img/logo.gif">
    
    
## Dynamic Pages

Dynamically created pages are stored in `app`. Grill assumes you will use
a MVC design, and encourages that with corresponding folders:

    app/controllers
    app/models
    app/views

Unlike a typical Express, Grill configures paths using the controller files. 
See app/controllers/README.md for more info.
 
### Views

Views use the underscore templating system. In this case, underscore templates 
have been extended with an `includes` command, that will load other 
templates. See the documentation at 
[express-lodash](https://www.npmjs.com/package/lodash-express).
    
           
## Swagger for Web Services

Unlike dynamic pages, web services expose a REST-style api, typically returning
json payloads. Grill recommends that you implement web services using Swagger. 

To help with this, Grill offers the `ws` folder, where you can store swagger
files. The same folder also has the swagger ui folder.


## Flyway for relational DB changes

Flyway is a java-based tool for applying changes to a relational database. Grill
recommends this tool as a sane way to manage and version DB migrations. If you
want to know more, check the README in the `flyway` folder.

