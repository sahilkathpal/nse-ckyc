function authOnly (req, res, next) {
  if (! req.user) return res.redirect('/login');
  next();
}

function guestOnly (req, res, next) {
  if (req.user) return res.redirect('/');
  next();
}

module.exports = {authOnly: authOnly, guestOnly: guestOnly};
