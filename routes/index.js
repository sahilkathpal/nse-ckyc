var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Login page. */
router.get('/login', guestOnly, function(req, res, next) {
  res.render('sessions/login');
});
router.get('/test', guestOnly, function(req, res, next) {
  res.render('banks/create');
});

function authOnly (req, res, next) {
  if (! req.user) return res.redirect('/login');
  next();
}

function guestOnly (req, res, next) {
  if (req.user) return res.redirect('/');
  next();
}

module.exports = router;
