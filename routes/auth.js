var express = require('express');
var router = express.Router();

module.exports = function (passport) {
  /* GET users listing. */
  router.post('/register', userController.register);
  return router;
}
