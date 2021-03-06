var express = require('express');
var mongoose = require('mongoose');
var mongoModels = require('../mongo/models');
var sessions = require('client-sessions');
var bcrypt = require('bcryptjs');

var router = express.Router();

/**
 * POST Handler - Validate the user credentials.
 * Redirect to home page if the credentials are valid, otherwise render the login page again.
 */
router.post('/', function(req, res, next) {
    mongoModels.User.findOne({ email: req.body.email }, function(err, user) {
        var errorMsg1 = "Incorrect Email or Password";

        if(!user) {
            res.render('index', { title: 'Login', errorMsg: errorMsg1 });
        }
        else {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                req.session.user = user;
                res.redirect('/home');
            }
            else {
                res.render('index', { title: 'Login', errorMsg: errorMsg1 });
            }
        }
    })
});

module.exports = router;