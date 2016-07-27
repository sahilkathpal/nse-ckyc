var express = require('express');
var router = express.Router();

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

  router.get('/query', queryFrm);
  router.get('/create', createFrm);
  router.get('/update', updateFrm);

  router.post('/query', );

  return router;
}
