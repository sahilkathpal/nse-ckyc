module.exports = function () {
  var express = require('express');
  var router = express.Router();

  var user = require('../controllers/userController')();

  router.post('/customers/fetch', user.fetchForBank);

  return router;
}
