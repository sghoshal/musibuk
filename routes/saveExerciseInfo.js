var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

var ObjectId = require('mongodb').ObjectID;

var router = express.Router();

function updateExerciseAndFolder(req, res, next) {

    var exerciseId = req.body.exerciseId;
    var folderId = req.body.folderId;
    var timePracticed = req.body.timePracticed;
    var bpm = req.body.bpm;

    console.log("Route: /saveExerciseInfo : Ex ID: %s, Folder ID: %s, Time Practiced: %s, BPM: %s",
                        exerciseId, folderId, timePracticed, bpm);

    var timeSplitArray = timePracticed.split(":");
    var timeInSeconds = parseInt(timeSplitArray[0]) * 3600 + parseInt(timeSplitArray[1]) * 60 + parseInt(timeSplitArray[2]);

    console.log("Time parsed into seconds: %s", timeInSeconds);

    var today = new Date();

    updateExercise(req, res, next, exerciseId, folderId, timeInSeconds, bpm, today);
}

function updateExercise(req, res, next, exerciseId, folderId, timeInSeconds, bpm, today) {
    
    mongoModel.Exercise.findById(new ObjectId(exerciseId.toString()), function (err, exerciseDoc) {
        if (err) {
            console.log("Error in finding exercise ID: %s", exerciseIdString);
        }
        else {
            exerciseDoc.lastUpdated = today;
            exerciseDoc.lastPracticeTime = timeInSeconds;
            exerciseDoc.totalPracticeTime = exerciseDoc.totalPracticeTime + timeInSeconds;

            exerciseDoc.save(function(err) {
                if(err) {
                    console.log("Error in saving exercise: %s", exerciseId);
                }
                else {
                    // var returnHtml = '<p id="bpmText">BPM: ' + newBpm + '</p>';
                    // res.send(returnHtml);
                    updateFolder(req, res, next, folderId, timeInSeconds, today);
                }
            });
        }
    });   
}

function updateFolder(req, res, next, folderId, timeInSeconds, today) {
    res.send("");
}

router.post('/', updateExerciseAndFolder);

module.exports = router;