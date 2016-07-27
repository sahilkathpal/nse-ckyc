var User = require('../models/User');
module.exports = function () {
  var erisdbURL = "http://localhost:1337/rpc";
  var promise = new Promise (function (resolve, reject) {
    User.findOne({role: 9})
    .then(function (nse) {
      var accountData = {address: nse.address, pubKey: nse.pub_key, privKey: nse.priv_key};
      var contractData = require('../../.eris/apps/nse-ckyc/epm.json');
      var kycContractAddress = contractData["deployV1"];
      var kycAbi = JSON.parse(fs.readFileSync("../../.eris/apps/nse-ckyc/abi/" + kycContractAddress));
      var contractsManager = erisC.newContractManagerDev(erisdbURL, accountData);
      var contract = contractsManager.newContractFactory(kycAbi).at(kycContractAddress);
      resolve(contract);
    })
    .catch(function (err) {
      reject(err);
    });
  });
  return promise;
}
