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
            console.log("Error in finding exercise ID: %s", exerciseId);
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
                    var totalTimeHours = parseInt( exerciseDoc.totalPracticeTime / 3600 );
                    var totalTimeMinutes = parseInt( exerciseDoc.totalPracticeTime / 60 ) % 60;
                    var totalTimeSeconds = parseInt( exerciseDoc.totalPracticeTime % 60 );

                    var totalExercisePracticeTimeString = totalTimeHours + " hours, " + 
                                                            totalTimeMinutes + " minutes, " + 
                                                            totalTimeSeconds + " seconds";
                    
                    updateFolder(req, res, next, folderId, totalExercisePracticeTimeString, timeInSeconds, today);
                }
            });
        }
    });   
}

function updateFolder(req, res, next, folderId, totalExercisePracticeTimeString, timeInSeconds, today) {
    mongoModel.Folder.findById(new ObjectId(folderId.toString()), function (err, folderDoc) {
        if (err) {
            console.log("Error in finding folder ID: %s", folderId);
        }
        else {
            folderDoc.lastUpdated = today;
            folderDoc.lastPracticeTime = timeInSeconds;
            folderDoc.totalPracticeTime = folderDoc.totalPracticeTime + timeInSeconds;

            folderDoc.save(function(err) {
                if(err) {
                    console.log("Error in saving folder: %s", folderId);
                }
                else {
                    res.send(totalExercisePracticeTimeString);
                }
            });
        }
    });
}

router.post('/', updateExerciseAndFolder);

module.exports = router;