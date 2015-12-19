var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var router = express.Router();

/**
 * Create an exercise in collection - 'exercise' on a Post request.
 */
router.post('/', function(req, res, next) {

    console.log('Creating Exercise: %s in Folder: %s with Notes: %s', 
        req.body.exerciseName, req.body.folderName, req.body.exerciseNotes);

    var exercise = new mongoModel.Exercise({
        user_id:            req.user.email,
        name:               req.body.exerciseName,
        entryType:          "exercise",
        notes:              req.body.exerciseNotes,
        folderId:           req.body.folderName,
        createdTime:        new Date(), 
        bpm:                80,
        bpmGoal:            140,
        maxPracticeTime:    600,
        lastUpdated:        new Date(),
        lastPracticeTime:   0,
        totalPracticeTime:  0,
        history:            [],
    });
        
    exercise.save(function(err, exercise) {
        if(err) {

            var errorMsg = 'Could not save the exercise to DB. Try again!';
            
            if(err.code === 11000) {
                errorMsg = 'That exercise name is already taken. Try another!';
            }
            
            console.log("%s. Exercise: %s\nStack: %s", errorMsg, req.body.exerciseName, err.stack);
        }

        req.flash('errorMsg', errorMsg);
        res.redirect('../home');
    });
});

module.exports = router;