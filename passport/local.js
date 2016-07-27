module.exports = function (passport, LocalStrategy) {

  var User = require('../models/User.js');
  var bCrypt = require('bcrypt');

  passport.use('login', new LocalStrategy({ passReqToCallback : true, usernameField: 'email', passwordField: 'password' }, function(req, email, password, done) {
      // check in mongo if a user with username exists or not
      console.log(req.body, email, password);
      User.findOne({ 'email':  email },
        function(err, user) {
          console.log(err, user);
          // In case of any error, return using the done method
          if (err)
            return done(err);
          // Username does not exist, log error & redirect back
          if (!user){
            return done('User Not Found', false);
          }
          // User exists but wrong password, log the error
          if (!isValidPassword(user, password)){
            return done("Invalid Password", false);
          }
          // User and password both match, return user from
          // done method which will be treated like success
          return done(null, user);
        }
      );
    })
  );

  function isValidPassword(user, password) {
    var result =  bCrypt.compareSync(password, user.password);
    console.log(result);
    return result;
  }

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  return passport;
}
