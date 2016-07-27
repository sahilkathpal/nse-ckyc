var express = require('express');
var router = express.Router();

module.exports = function () {
  var user = require('../controllers/userController')();

  function createBankFrm (req, res, next) {
    return res.render('banks/create');
  }

  router.post('/', user.create);
  router.get('/create', createBankFrm);
  router.get('/', user.getAll);
  router.get('/:bankId', user.manageBank);
  router.get('/:bankId/redeem', user.redeem);


  return router;
}
