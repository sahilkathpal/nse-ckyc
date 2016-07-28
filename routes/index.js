module.exports = function (passport) {
  var express = require('express');
  var router = express.Router();
  var auth = require('../helpers/session');

  /* GET home page. */
  router.get('/', auth.authOnly, function(req, res, next) {
    res.render('index', { title: 'Express', user: req.user });
  });

  /* GET Login page. */
  router.get('/login', auth.guestOnly, function(req, res, next) {
    res.render('sessions/login');
  });

  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login-failure'
  }));

  router.post('/login-failure', function (req, res) {
    return res.sendStatus(500);
  });

  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
};
