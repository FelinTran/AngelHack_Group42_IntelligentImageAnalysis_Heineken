var express = require('express');
var router = express.Router();
const passport = require('passport');
const { isAuthenticated } = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile', function(req, res, next) {
  res.send('respond with a profile');
});

router.post('/analyze', function(req, res, next) {
  
});

module.exports = router;
