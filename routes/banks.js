var express = require('express');
var router = express.Router();

module.exports = function () {
  var user = require('../controllers/userController.js')();

  function createBankFrm (req, res, next) {
    return res.render('banks/create');
  }


  // router.get('/create', function (req, res) {
  //   res.render('');
  // });
  router.post('/', user.create);
  router.get('/create', createBankFrm);
  router.get('/', user.getAll);
  router.get('/:bankId', user.manageBank);


  return router;
}
