var User = require('../models/User.js');
var erisdb = require('eris-db');

module.exports = function () {


  function createHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  function registerBank(req, res) {

    User.findOne({'username':username},function(err, user) {
      // In case of any error return
      if (err){
        console.log('Error in SignUp: '+err);
        return;
      }
      // already exists
      if (user) {
        console.log('User already exists');
        return;
      }
      var newBank = createBank(req.body);
      var newUser = new User();
      // set the user's local credentials
      newUser.username = bank.username;
      newUser.password = createHash(bank.password);

      // save the user
      newUser.save(function(err) {
        if (err){
          console.log('Error in Saving user: '+err);
          throw err;
        }
        console.log('User Registration succesful');
        createAndActivateAddress(newUser);
      });
    });
  }

  function createAndActivateAddress(bank) {
    var edb = erisdb.createInstance();
    edb.start(function(error, obj){
        if(!error){
            console.log("Ready to go");
        }
        obj.accounts().genPrivAccount({}, function (error, keyPair) {
          var accountData = keyPair;
          User.findOne({username: bank.username})
          .then(function (newBank) {
            newBank.address = accountData.address;
            newBank.pub_key = accountData.pub_key;
            newBank.priv_key = accountData.priv_key;
            newBank.save(function(err) {
              if (err){
                console.log('Error in Saving user: '+err);
                throw err;
              }
              console.log('User Registration succesful');
            });
          })
          User.findOne({role:"nse"})
          .then(function (nse) {
            var myKey = nse.priv_key;
            var myAddress = nse.address;
            var newKey = accountData.priv_key[1];
            var newAddress = accountData.address;
            //return res.send(accountData);
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
    });
  }


  return {
    registerBank: registerBank
  }
}
