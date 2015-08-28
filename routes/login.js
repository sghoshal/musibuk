var express = require('express');
var mongoose = require('mongoose');
var mongoModels = require('../mongo/models');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');
var csrf = require('csurf');

var router = express.Router();

// Use csrf for Cross-Site Request Forgery Protection
// Generates a new token each time the login page is refreshed.
router.use(csrf());

router.post('/', function(req, res, next) {
    mongoModels.User.findOne({ email: req.body.email }, function(err, user) {
        var errorMsg1 = "Incorrect Email or Password";

        if(!user) {
            res.render('index', { title: 'Login', errorMsg: errorMsg1, csrfToken: req.csrfToken() });
        }
        else {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;
                res.redirect('/home');
            }
            else {
                res.render('index', { title: 'Login', errorMsg: errorMsg1, csrfToken: req.csrfToken() });
            }
        }
    })
});

module.exports = router;