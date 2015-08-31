var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');
var csrf = require('csurf');

var router = express.Router();

router.use(csrf());

router.post('/', function(req, res, next) {

    console.log('Folder: %s', req.body.folderName);

    var exercise = new mongoModel.Exercise({
        user_id:    req.user.email,
        name:       req.body.exerciseName,
        folder:     req.body.folderName
    });
    
    // TODO: Needs refactoring from callback hell.
    
    exercise.save(function(err, exercise) {
        if(err) {
            var errorMsg = 'Could not save the exercise to DB. Try again!';
            
            if(err.code === 11000) {
                errorMsg = 'That exercise name is already taken. Try another!';
            }
            
            console.log("%s. Exercise: %s", errorMsg, req.body.exerciseName);
        }

        req.flash('errorMsg', errorMsg);
        res.redirect('../home');
    });
});

module.exports = router;