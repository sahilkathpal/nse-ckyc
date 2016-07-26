var Bank = require('../models/Bank.js');
var erisdb = require('eris-db');

module.exports = function () {

  function add(req, res) {
    var edb = erisdb.createInstance();
    edb.start(function(error, obj){
        if(!error){
            console.log("Ready to go");
        }
        obj.accounts().genPrivAccount({}, function (error, keyPair) {
          var accountData = keyPair;
          var myKey = "2C9DF3F3FDCEB8D415B880DD69A458402FE50541CCBDBBC2371A3009A0D9CB7414CE21600E640B1D62C968C9E8DD4434A51ADDBD8EED069C6F2EBDCE0FF27F46";
          var myAddress = "F4E1DC265201E5684F0509EC2E543086440A8DED";
          var newKey = accountData.priv_key[1];
          var newAddress = accountData.address;
          return res.send(accountData);
          obj.txs().send(myKey, newAddress, 100, {}, function (error, result) {
            if (error) {
              console.log(error);
              return;
            }
            obj.txs().send(newKey, myAddress, 50, {}, function (error, result1) {
              if(error) {
                console.log(error);
                return;
              }
              console.log("Successfully registered new Bank");
            })
          });
        });
    });
  }

  return {
    add: add
  }
}
