var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var swig = require('swig');
mongoose.connect('mongodb://localhost/ckyc');

var app = express();
var bCrypt = require("bcrypt");
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
passport = require('./passport/local.js')(passport, localStrategy);
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.set('view cache', false);
swig.setDefaults({ cache: false, varControls: ['<%=', '%>'] });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index')(passport);
var users = require('./routes/users');
var auth = require('./routes/auth')();
var banks = require('./routes/banks')();

app.use('/', routes);
app.use('/users', users);
app.use('/customers', require('./routes/customers')());
app.use('/auth', auth);
app.use('/banks', banks);
app.use('/load-balance', require('./routes/load-balance')());
app.get('/nsepass', function (req, res) {

  res.send(bCrypt.hashSync("nse", bCrypt.genSaltSync(10), null));

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
