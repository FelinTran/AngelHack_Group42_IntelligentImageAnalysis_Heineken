var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({MessageEvent: 'Welcome to the backend!'})
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
  if (req.isAuthenticated()) res.status(200).send({message: 'Login Successfully!'});
  else res.status(401).send({message: 'Unauthorized'});
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.status(200).send({message: 'Logout Successfully!'});
});

module.exports = router;
