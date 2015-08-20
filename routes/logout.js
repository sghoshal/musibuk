var express = require('express');
var sessions = require('client-sessions');

var router = express.Router();

router.use(sessions( {
    cookieName: 'session',
    secret: 'asdkjbasfkjnwefoqiwer',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));
 
// GET request handler on /logout
router.get('/', function(req, res, next) {
    req.session.reset();
    res.redirect('..');
});

module.exports = router;