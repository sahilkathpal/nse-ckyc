var express = require('express');
var router = express.Router();
var auth = require('../helpers/session');

module.exports = function () {
  var user = require('../controllers/userController')();

  function createBankFrm (req, res, next) {
    return res.render('banks/create', {user: req.user});
  }

  router.post('/', user.create);
  router.get('/create', auth.authOnly, createBankFrm);
  router.get('/', auth.authOnly, user.getAll);
  router.get('/:bankId', auth.authOnly, user.manageBank);
  router.post('/:bankId/redeem', auth.authOnly, user.redeem);

  return router;
}
