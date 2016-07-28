var User = require('../models/User.js');
var ObjectId = require('mongoose').Types.ObjectId;
var erisdb = require('eris-db');
var contractPromise = require('../helpers/contract')();

module.exports = function () {
 var bCrypt = require('bcrypt');


  function create(req, res) {

    User.findOne({'email':req.body.email},function(err, user) {
      // In case of any error return
      if (err){
        console.log('Error in SignUp: '+err);
        return res.sendStatus(500);
      }
      // already exists
      if (user) {
        console.log('User already exists');
        return res.send({message: 'User already exists'}, 409);
      }

      var edb = erisdb.createInstance();
      edb.start(function(error, obj){
        if(!error){
            console.log("Ready to go");
        }
        obj.accounts().genPrivAccount({}, function (error, keyPair) {
          var accountData = keyPair;
          User.findOne({role:9})
          .then(function (nse) {
            var myKey = req.user.priv_key;
            var myAddress = req.user.address;
            var newKey = accountData.priv_key[1];
            var newAddress = accountData.address;
            obj.txs().send(myKey, newAddress, 20, {}, function (error, result) {
              if (error) {
                console.log(error);
                return;
              }
              obj.txs().send(newKey, myAddress, 15, {}, function (error, result1) {
                if(error) {
                  console.log(error);
                  return;
                }
                console.log("Successfully registered new Bank");
                var newUser = new User();
                // set the user's local credentials
                newUser.email = req.body.email;
                newUser.password = createHash(req.body.password);
                newUser.role = 1;
                newUser.name = req.body.name;
                newUser.branch = req.body.branch;
                newUser.address = accountData.address;
                newUser.pub_key = accountData.pub_key[1];
                newUser.priv_key = accountData.priv_key[1];

                // save the user
                newUser.save(function(err) {
                  if (err){
                    console.log('Error in Saving user: '+err);
                    throw err;
                  }
                  res.sendStatus(200);
                });
              })
            });
          });
        });
      });
    });
  }

  function getAll(req, res) {
    User.find({role: 1}).select("name branch email address")
    .then(function (banks) {
      console.log(banks);
      return res.render('banks/list', {banks: banks});
    });
  }

  function manageBank (req, res) {
    User.findOne({_id: new ObjectId(req.params.bankId)}).exec()
    // .select('email name branch address').exec()
    .then(function (bank) {
      // if (err) return res.send(err, 500)
      contractPromise.then(function (contract) {
        contract.getMyCount(function (err, count) {
          console.log('inside getMyCount', err, count.toNumber());
          if (err) return res.send(err, 500)
          bank.count = count
          return res.render('banks/manage', {bank: bank})
        })
      })
    })
    .catch(function (err) {
      console.log(err);
      res.send(err);
    })

    // var bank;
    // User.findOne({_id: new ObjectId(req.params.resourceId)}).exec()
    // .then(function (bankData) {
    //   bank = bankData;
    //   return contractPromise;
    // })
    // .then(function (contract) {
    //   contract.getMyCount(fetchedCount);
    // })
    // .catch(function (err) {
    //   return res.send(err, 500);
    // });
    // function fetchedCount (err, count) {
    //   if (err)
    //     return res.send(err, 500);
    //   bank.count = count;
    //   return res.render('banks/manage', {bank: bank})
    // }
  }

  function redeem (req, res) {
    contractPromise.then(function (contract) {
      contract.reset(parseInt(req.body.amount), function (err, data) {
        if (err) return res.send(err, 500)
        res.sendStatus(200)
      })
    })
  }

  function createHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  return {
    create: create,
    getAll: getAll,
    manageBank: manageBank,
    redeem: redeem,
  }
}
