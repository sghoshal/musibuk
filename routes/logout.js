var express = require('express');
var sessions = require('client-sessions');

var router = express.Router();

/**
 * GET Handler - Clear the user session and redirect to login page.
 */
router.get('/', function(req, res, next) {
    req.session.reset();
    res.redirect('..');
});

module.exports = router;