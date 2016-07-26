var express = require('express');
var router = express.Router();

module.exports = function () {
  var bank = require('../controllers/bankController.js')();

  router.post('/add', bankController.add());

  return router;
}
