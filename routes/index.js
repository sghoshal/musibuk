var express = require('express');
var csrf = require('csurf');

var router = express.Router();

// Use csrf for Cross-Site Request Forgery Protection
// Generates a new token each time the login page is refreshed.
router.use(csrf());

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user) {
        console.log('XXXX')
        res.redirect('/home');
    }
    else {
        res.render('index', { title: 'Musibuk - Login', csrfToken: req.csrfToken() });
    }
});

module.exports = router;