var User = require('../models/User.js');
var erisdb = require('eris-db');

module.exports = function () {
 var bCrypt = require('bcrypt');

  function createHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  function create(req, res) {

    User.findOne({'email':req.body.email},function(err, user) {
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
      var newUser = new User();
      // set the user's local credentials
      newUser.email = req.body.email;
      newUser.password = createHash(req.body.password);
      newUser.role = 1;
      newUser.name = req.body.name;
      newUser.branch = req.body.branch;

      // save the user
      newUser.save(function(err) {
        if (err){
          console.log('Error in Saving user: '+err);
          throw err;
        }
        console.log('User Registration succesful');
        var edb = erisdb.createInstance();
        edb.start(function(error, obj){
          if(!error){
              console.log("Ready to go");
          }
          obj.accounts().genPrivAccount({}, function (error, keyPair) {
            var accountData = keyPair;
            User.findOne({email: newUser.email})
            .then(function (newBank) {
              newBank.address = accountData.address;
              newBank.pub_key = accountData.pub_key[1];
              newBank.priv_key = accountData.priv_key[1];
              newBank.save(function(err) {
                if (err){
                  console.log('Error in Saving user: '+err);
                  throw err;
                }
                console.log('User Registration succesful');
              });
            })
            User.findOne({role:9})
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
                  res.sendStatus(200);
                })
              });
            });
          });
        });
      });
    });
  }



  return {
    create: create
  }
}
