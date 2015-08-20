var express = require('express');
var queryString = require('querystring');

var router = express.Router();

function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('..');
    }
    else {
        console.log('requireLogin App details: %s', req.session.user);
        next();
    }
}

router.get('/', requireLogin, function(req, res, next) {
    console.log('router get App details: %s', req.session.user);
    res.render('home', { title: 'Home' });
});

module.exports = router;