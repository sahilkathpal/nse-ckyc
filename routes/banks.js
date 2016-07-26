var express = require('express');
var router = express.Router();

module.exports = function () {
  var user = require('../controllers/userController.js')();

  // router.get('/create', function (req, res) {
  //   res.render('');
  // });
  router.post('/', user.create);


  return router;
}
