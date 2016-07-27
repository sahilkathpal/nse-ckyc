var User = require('../models/user');
module.exports = function () {
  var erisdbURL = "http://localhost:1337/rpc";
  return User.findOne({role: 9})
  .then(function (nse) {
    var accountData = {address: nse.address, pubKey: nse.pub_key, privKey: nse.priv_key};
    var contractData = require('../../.eris/apps/nse-ckyc/epm.json');
    var kycContractAddress = contractData["deployV1"];
    var kycAbi = JSON.parse(fs.readFileSync("./abi/" + kycContractAddress));
    var contractsManager = erisC.newContractManagerDev(erisdbURL, accountData);
    var contract = contractsManager.newContractFactory(kycAbi).at(kycContractAddress);
    return contract;
  })
}
