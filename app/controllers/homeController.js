'use strict';

process.app.get('/', renderHomePage);

function renderHomePage(req, res) {
  res.render('default', {title: 'Default Page'});
}
