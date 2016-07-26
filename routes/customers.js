var express = require('express');
var router = express.Router();

module.exports = function () {

  function query (req, res, next) {
    return res.render('customers/query');
  }
  function create (req, res, next) {
    return res.render('customers/create');
  }

  router.get('/query', query);
  router.get('/create', create);
  router.get('/update', query);


  return router;
}
