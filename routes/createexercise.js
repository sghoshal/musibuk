var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');
var csrf = require('csurf');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var router = express.Router();

router.use(csrf());

router.post('/', function(req, res, next) {

    console.log('Folder: %s', req.body.folderName);

    var exercise = new mongoModel.Exercise({
        user_id:        req.user.email,
        name:           req.body.exerciseName,
        bpm:            80,
        folderId:       req.body.folderName,
        createdTime:    new Date(),
        lastUpdated:    new Date(),
        timePracticed:  0,
        history:        []
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