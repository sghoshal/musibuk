var express = require('express');
var csrf = require('csurf');

var router = express.Router();

router.use(csrf());

function requireLogin(req, res, next) {
    if(!req.user) {
        res.redirect('..');
    }
    else {
        console.log('Route: createexercise. Found session user: %s', req.user);
        next();
    }
}

router.post('/', requireLogin, function(req, res, next) {
    res.render('home', { title: req.body.exerciseName, 'csrfToken': req.csrfToken() } );
});

module.exports = router;