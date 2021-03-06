var User = require('../models/User.js');
var ObjectId = require('mongoose').Types.ObjectId;
var erisdb = require('eris-db');
var bCrypt = require('bcrypt');
var hex = require('../helpers/hex');
var superAgent = require('superagent');

module.exports = function () {


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
            obj.txs().send(myKey, newAddress, 1000, {}, function (error, result) {
              if (error) {
                console.log(error);
                return;
              }
              obj.txs().send(newKey, myAddress, 1, {}, function (error, result1) {
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
      return res.render('banks/list', {banks: banks, user: req.user});
    });
  }

  function manageBank (req, res) {
    var accountData = {
      address: req.user.address,
      pubKey:  req.user.pub_key,
      privKey:  req.user.priv_key
    };
    var contractPromise = require('../helpers/contract')(accountData);
    User.findOne({_id: new ObjectId(req.params.bankId)}).exec()
    // .select('email name branch address').exec()
    .then(function (bank) {
      // if (err) return res.send(err, 500)
      contractPromise.then(function (contract) {
        contract.getMyCount(bank.address, function (err, count) {
          if (err) return res.send(err, 500)
          return res.render('banks/manage', {bank: bank, count: count.toNumber(), user: req.user})
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
    var accountData = {
      address: req.user.address,
      pubKey:  req.user.pub_key,
      privKey:  req.user.priv_key
    };
    var contractPromise = require('../helpers/contract')(accountData);
    contractPromise.then(function (contract) {
      contract.reset(parseInt(req.body.address, req.body.amount), function (err, data) {
        if (err) return res.send(err, 500)
        res.sendStatus(200)
      })
    })
  }

  function fetchForBank (req, res) {
    var ip = loadBalance();
    console.log("in fetchForBank");
    var accountData = {
      address: req.body.address,
      pubKey: req.body.pub_key,
      privKey: req.body.priv_key
    }
    var contractPromise = require('../helpers/contract')(accountData, ip);
    contractPromise.then(function (contract) {
      console.log("in contract");
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
        console.log("in pan");
        contract.findByPan(value, function (error, customerData) {
          console.log("in find");
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

  function loadBalance() {
    var validators = ["13.75.92.175","52.175.24.134","52.175.33.133","52.175.25.248"];
    var seeds = ["13.75.94.127", "13.75.89.110"];
    superAgent.get('http://'+seeds[0]+":46657/net_info")
    .then(function (peers) {
      return peers.result[1].peers[0].node_info.host;
    })
    .catch(function (error) {
      seeds = seeds.splice(1);
      superAgent.get('http://'+seeds[1]+":46657/net_info")
      .then(function (peers) {
        return peers.result[1].peers[0].node_info.host;
      })
    });
  }

  function createHash(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  }

  return {
    create: create,
    getAll: getAll,
    manageBank: manageBank,
    fetchForBank: fetchForBank,
    redeem: redeem
  }
}
