var express = require('express');
var csrf = require('csurf');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

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
    
    mongoModel.Exercise.find(function(err, allExercises) {
        if(err) {
            console.log('home.js: Could not fetch all exercises.');
        }
        else {
            res.render('home', { title: 'Home' , 
                        csrfToken: req.csrfToken(),
                        allExercises: allExercises });
        }
    });
});

module.exports = router;