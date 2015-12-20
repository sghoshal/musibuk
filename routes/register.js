var express = require('express');
var mongoose = require('mongoose');
var mongoModels = require('../mongo/models');
var bcrypt = require('bcryptjs');

var router = express.Router();

/**
 * GET handler - Render the registration page.
 */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

/**
 * POST handler - Store a bcrypt hash of the password.
 */
router.post('/', function(req, res) {

    var passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    var user = new mongoModels.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash
    });

    user.save(function(err, user) {
        if(err) {
            var error = 'Could not register user. Try again!';
            if(err.code === 11000) {
                error = 'That email is already taken, try another!';
            }
            res.render('register', { title: 'Musibuk - Register', error: error });
        }
        else {
            // console.log('Registered user: First Name: %s, Last Name: %s, Email: %s, Password: %s',
            //                user.firstName, user.lastName, user.email, user.password);
            res.redirect('..')
        }
    });
})

module.exports = router;