module.exports = function () {
  const router = require('express').Router()
  var user = require('../controllers/userController')();

  router.post('/customers/fetch', user.fetchForBank);

  return router;
}
