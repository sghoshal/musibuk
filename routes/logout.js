var express = require('express');
var sessions = require('client-sessions');

var router = express.Router();

// GET request handler on /logout
router.get('/', function(req, res, next) {
    req.session.reset();
    res.redirect('..');
});

module.exports = router;