var express = require('express');
var router = express.Router();
var auth = require('../helpers/session');

module.exports = function () {
  var customer = require("../controllers/customerController")();

  function queryFrm (req, res, next) {
    return res.render('customers/query');
  }
  function createFrm (req, res, next) {
    return res.render('customers/create');
  }
  function updateFrm (req, res, next) {
    return res.render('customers/update', {ckyc: req.query.ckyc});
  }

  router.get('/query', auth.authOnly, queryFrm);
  router.get('/create', auth.authOnly, createFrm);
  router.get('/update', auth.authOnly, updateFrm);

  router.post('/', customer.createCustomer);
  router.put('/update', customer.updateCustomer);
  router.post('/fetch', customer.getCustomer);

  // router.post('/query', );

  return router;
}
