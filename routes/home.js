var express = require('express');
var csrf = require('csurf');

var router = express.Router();

router.use(csrf());

function requireLogin(req, res, next) {
    if (!req.user) {
        res.redirect('..');
    }
    else {
        console.log('Route: requireLogin. Found session user: %s', req.session.user);
        next();
    }
}

router.get('/', requireLogin, function(req, res, next) {
    res.render('home', { title: 'Home' , csrfToken: req.csrfToken() });
});

module.exports = router;