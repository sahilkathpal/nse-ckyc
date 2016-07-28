module.exports = function () {
  const router = require('express').Router()
  function fetchCustomer (req, res) {
    res.send('12')
  }
  router.post('/customers/fetch', fetchCustomer)

  return router
}
