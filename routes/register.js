var express = require('express');
var mongoose = require('mongoose');
var csrf = require('csurf');
var mongoModels = require('../mongo/models');
var bcrypt = require('bcryptjs');

var router = express.Router();

// Use csrf for Cross-Site Request Forgery Protection
// It generates a new token every time the register page is loaded.
// The form submitted should have this unique token.

router.use(csrf());

// GET request handler on /register
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Register', csrfToken: req.csrfToken() });
});

// POST request handler on /register
router.post('/', function(req, res) {

    var passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    var userModel = new mongoModels.UserModel({

        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: passwordHash
    });

    userModel.save(function(err, user) {
        if(err) {
            var error = 'Something bad happened! Try again!';
            if(err.code === 11000) {
                error = 'That email is already taken, try another!';
            }
            res.render('register', { title: 'Musibuk - Register', error: error });
        }
        else {
            console.log('Registered user: First Name: %s, Last Name: %s, Email: %s, Password: %s', 
                            user.firstName, user.lastName, user.email, user.password);
            res.redirect('..')
        }
    })
})

module.exports = router;