var express = require('express');
var router = express.Router();

module.exports = function () {

  var user = require('../controllers/userController.js')();

  router.post('/register', user.registerBank);

  return router;
}
