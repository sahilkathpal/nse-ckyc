var mongoose = require ("mongoose");

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  role: Number,
  address: String,
  pub_key: String,
  priv_key: String
});

module.exports = mongoose.model('User', userSchema);
