var User = require('../models/User');
var fs = require('fs');
var erisC = require("eris-contracts");
module.exports = function (accountData) {
  var erisdbURL = "http://localhost:1337/rpc";
  var promise = new Promise (function (resolve, reject) {
    User.findOne({role: 9}, function (err, nse) {
      if (err) return reject(err);
      var accountData = {address: nse.address, pubKey: nse.pub_key, privKey: nse.priv_key};
      var contractData = require('../../.eris/apps/ckyc_v1/epm.json');
      var kycContractAddress = contractData["deployV1"];
      var kycAbi = JSON.parse(fs.readFileSync("../.eris/apps/ckyc_v1/abi/" + kycContractAddress));
      var contractsManager = erisC.newContractManagerDev(erisdbURL, accountData);
      var contract = contractsManager.newContractFactory(kycAbi).at(kycContractAddress);
      resolve(contract);
    });
  });

  return promise;
}
