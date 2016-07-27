var User = require("../models/User");
var erisdb = require('eris-db');
var erisC = require('eris-contracts');
var hex = require('../helpers/hex');
var Hashids = require('hashids');
var hashids = new Hashids("this is my salt", 8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
var contractPromise = require("../helpers/contract")();
module.exports = function () {
  function getCustomer(req, res) {
    // var accountData = req.user.
    var contractPromise = require('../helpers/contract')();
    contractPromise.then(function (contract) {
      var value = hex.str2hex(req.body.value);

      if(req.body.key == "ckyc") {
        contract.findByCkycId(value, function (error, customerData) {
          if(error) res.send(error, 500);
          var result = customerData.map(function (customerDatum) {
             return hex.hex2str(customerDatum);
          });
          if(result[4] == "") return res.sendStatus(409);
          return res.send(result);
        })
      }

      if(req.body.key == "passport") {
        contract.findByPassport(value, function (error, customerData) {
          if(error) res.send(error, 500);
          var result = customerData.map(function (customerDatum) {
            return hex.hex2str(customerDatum);
          });
          if(result[4] == "") return res.sendStatus(409);
          return res.send(result);
        })
      }

      if(req.body.key == "aadhar") {
        contract.findByAadhar(value, function (error, customerData) {
          if(error) res.send(error, 500);
          var result = customerData.map(function (customerDatum) {
            return hex.hex2str(customerDatum);
          });
          if(result[4] == "") return res.sendStatus(409);
          return res.send(result);
        })
      }

      if(req.body.key == "pan") {
        contract.findByPan(value, function (error, customerData) {
          if(error) res.send(error, 500);
          var result = customerData.map(function (customerDatum) {
            return hex.hex2str(customerDatum);
          });
          if(result[4] == "") return res.sendStatus(409);
          return res.send(result);
        })
      }

    });

  }

  function createCustomer(req, res) {
    contractPromise.then(function (contract) {
      var obj = req.body;

      contract.addCustomer(hex.str2hex('ckyc'), hex.str2hex(hashids.encode(Date.now())), function (error) {
        if(error) return res.send(error, 500);
        console.log("In add");
        obj.slice(1).forEach(function (entry) {
          console.log("In update");
          contract.updateCustomer(hex.str2hex(obj[0]['value']), hex.str2hex(entry.key), hex.str2hex(entry.value), function (error) {
          });
        });
        return res.sendStatus(200);
      });
    });
  }

  function updateCustomer(req, res) {
    contractPromise.then(function (contract) {
      contract.updateCustomer(hex.str2hex(req.body.ckyc), hex.str2hex(req.body.key), hex.str2hex(req.body.value), function (error) {
        if (error) return res.send(error, 500);
        return res.sendStatus(200);
      })
    })
  }

  return {
    getCustomer: getCustomer,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer
  }
}
