var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.user) {
        res.redirect('/home');
    }
    else {
        res.render('index', { title: 'Musibuk - Login' });
    }
});

module.exports = router;