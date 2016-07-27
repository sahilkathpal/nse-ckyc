var User = require("../models/User");
var erisdb = require('eris-db');
var erisC = require('eris-contracts');
var hex = require('../helpers/hex');
var contractPromise = require('../helpers/contract')();
console.log(contractPromise);
var _ = require('lodash');
module.exports = function () {
  function getCustomer(req, res) {
    contractPromise.then(function (contract) {
      console.log("In contract");
      var value = hex.str2hex(req.body.value);

      if(req.body.key == "ckyc") {
        console.log("In ckyc");
        contract.findByCkycId(value, function (error, customerData) {
          console.log("In findByCkycId");
          if(error) res.send(error, 500);
          customerData.forEach(function (customerDatum) {
            customerDatum = hex.hex2str(customerDatum);
          });
          return res.send(customerData);
        })
      }

      if(req.body.key == "passport") {
        contract.findByPassport(value, function (error, customerData) {
          if(error) res.send(error, 500);
          customerData.forEach(function (customerDatum) {
            customerDatum = hex.hex2str(customerDatum);
          });
          return res.send(customerData);
        })
      }

      if(req.body.key == "aadhar") {
        contract.findByAadhar(value, function (error, customerData) {
          if(error) res.send(error, 500);
          customerData.forEach(function (customerDatum) {
            customerDatum = hex.hex2str(customerDatum);
          });
          return res.send(customerData);
        })
      }

      if(req.body.key == "pan") {
        contract.findByPan(value, function (error, customerData) {
          if(error) res.send(error, 500);
          customerData.forEach(function (customerDatum) {
            customerDatum = hex.hex2str(customerDatum);
          });
          return res.send(customerData);
        })
      }

    });

  }

  function createCustomer(req, res) {
    console.log("In createCustomer");
    contractPromise.then(function (contract) {
      console.log("In contract");
      var obj = req.body;
      console.log(contract);
      contract.addCustomer(hex.str2hex(obj[0]['key'], str2hex(obj[0]['value']), function (error) {
        if(error) console.log(error);
        console.log("In add Customer");
        if(error) return res.send(error, 500);
        obj.slice(1).forEach(function (entry) {
          console.log("In update Customer");
          contract.updateCustomer(str2hex(obj[0]['value']), str2hex(entry.key), str2hex(entry.value), function (error) {
            console.log("Updated Customer");
          });
        });
        return res.sendStatus(200);
      }));
    });
  }

  function updateCustomer(req, res) {
    contractPromise.then(function (contract) {
      contract.updateCustomer(str2hex(req.body.ckyc), str2hex(req.body.key), str2hex(req.body.value), function (error) {
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
