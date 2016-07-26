var express = require('express');
var router = express.Router();

module.exports = function () {
  var user = require('../controllers/userController.js')();

  function createBankFrm (req, res, next) {
    return res.render('banks/create');
  }
  
  router.post('/', user.create);
  router.get('/create', createBankFrm);
  router.get('/', user.getAll);


  return router;
}
