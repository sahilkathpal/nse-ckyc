var User = require('../models/User');
var fs = require('fs');
var erisC = require("eris-contracts");
module.exports = function () {
  var erisdbURL = "http://localhost:1337/rpc";
  var promise = new Promise (function (resolve, reject) {
    // User.findOne({role: 9}, function (err, nse) {
    //   if (err) return reject(err);
    //   var accountData = {address: nse.address, pubKey: nse.pub_key, privKey: nse.priv_key};
    //   var contractData = require('../../.eris/apps/ckyc_v1/epm.json');
    //   var kycContractAddress = contractData["deployV1"];
    //   var kycAbi = JSON.parse(fs.readFileSync("../.eris/apps/ckyc_v1/abi/" + kycContractAddress));
    //   var contractsManager = erisC.newContractManagerDev(erisdbURL, accountData);
    //   var contract = contractsManager.newContractFactory(kycAbi).at(kycContractAddress);
    //   resolve(contract);
    // });
    var accountData = {address: '387F29A89B0112C5345414D66433EA78A6ABBAB6', pubKey: '5DDB7401D4C2CACCC6038A35995DEB73C3D65B1A1D43AD02BA976E1B23AA2C65', privKey: 'A31A5F04EB1C78C0D57E9DF1285C60AED34AE9D4C9E90D649B0271E7479F613C5DDB7401D4C2CACCC6038A35995DEB73C3D65B1A1D43AD02BA976E1B23AA2C65'};
    var contractData = require('../../.eris/apps/ckyc_v1/epm.json');
    var kycContractAddress = contractData["deployV1"];
    var kycAbi = JSON.parse(fs.readFileSync("../.eris/apps/ckyc_v1/abi/" + kycContractAddress));
    var contractsManager = erisC.newContractManagerDev(erisdbURL, accountData);
    var contract = contractsManager.newContractFactory(kycAbi).at(kycContractAddress);
    resolve(contract);
  });

  return promise;
}
