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

router.use(sessions( {
    cookieName: 'session',
    secret: 'asdkjbasfkjnwefoqiwer',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

function redirect_to_home (req, res){
    console.log("Session started. Redirecting user to home page");
    res.writeHead(301, {Location: '/home'});
    res.end();
}

router.post('/', function(req, res, next) {
    mongoModels.UserModel.findOne({ email: req.body.email }, function(err, user) {
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