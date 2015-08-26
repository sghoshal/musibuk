var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');
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
    var exercise = new mongoModel.Exercise({
        name: req.body.exerciseName,
    });
    
    // TODO: Needs refactoring from callback hell.
    
    exercise.save(function(err, exercise) {
        if(err) {
            var errorMsg = 'Could not save the exercise to DB. Try again!';
            
            if(err.code === 11000) {
                errorMsg = 'That exercise name is already taken. Try another!';
            }
            
            console.log('Error in creating exercise: %s', req.body.exerciseName );
            
            mongoModel.Exercise.find(function(err, allExercises) {
                if(err) {
                    console.log('Could not retrieve all exercise from Mongo DB');
                }
                else {
                    console.log('All exercises: %s', allExercises);
                    res.render('home', { title: 'Home', 
                                        'csrfToken': req.csrfToken(),
                                        'errorMsg': errorMsg,
                                        'allExercises': allExercises } );
                }
            });
        }
        else {
            mongoModel.Exercise.find(function(err, allExercises) {
                if(err) {
                    console.log('Could not retrieve all exercise from Mongo DB');
                }
                else {
                    console.log('All exercises: %s', allExercises);
                    res.render('home', { title: 'Home', 
                                        'csrfToken': req.csrfToken(),
                                        'allExercises': allExercises } );
                }
            });
            
        }
    });
});

module.exports = router;