# Database Changes

For changes to the raas portal database, we use [flyway](http://flywaydb.org/). 

Create a sql script to change the db, and save that script to 
```flyway/sql```. 

Begin your script with a ```USE``` statement, to select the database. Ie,

    USE tsdb;

Be sure to follow the 
[flyway naming conventions](http://flywaydb.org/documentation/migration/sql.html)
for your script.

To deploy your sql migration, from the shell, type:
 
(Mac)

    ./flyway migrate
    
(Windows)

    flyway migrate

Migrations are applied to to a default database, specified in:
 
    flyway/conf/flyway.conf
    
To apply migrations elsewhere, create a new config file, and pass the
path:

    ./flyway -configFile=conf/flyway.conf.altDB migrate

## Errors

### Metatable missing

If flyway complains about not having a metatable, run
 
    ./flyway baseline
    
Then you can run ```migrate``` again.

### SQL/Constraint Error

If there is an error in the sql, or a DB constraint error:

* fix the problem, either by adjusting the DB, or changing the sql script
* repair the metadata table:

    ./flyway repair
    
Then you can run ```migrate``` again.
    
