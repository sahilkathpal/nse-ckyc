var express = require('express');
var router = express.Router();
var auth = require('../helpers/session');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Login page. */
router.get('/login', auth.guestOnly, function(req, res, next) {
  res.render('sessions/login');
});

module.exports = router;
