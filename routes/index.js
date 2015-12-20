var express = require('express');

var router = express.Router();

/**
 * Render the login page. If the user session is already present then redirect to home page.
 */
router.get('/', function(req, res, next) {
    if(req.user) {
        res.redirect('/home');
    }
    else {
        res.render('index', { title: 'Musibuk - Login' });
    }
});

module.exports = router;