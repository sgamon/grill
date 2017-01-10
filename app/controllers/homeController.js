'use strict';

process.app.get('/', renderHomePage);
process.app.get('/jsx', renderJsxHomePage);

function renderHomePage(req, res) {
  res.render('default', {title: 'Default Page'});
}

function renderJsxHomePage(req, res) {
  res.render('default.jsx', {title: 'Default Page'});
}
