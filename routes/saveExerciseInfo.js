var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

var ObjectId = require('mongodb').ObjectID;

var router = express.Router();

function updateExerciseAndFolder(req, res, next) {

    var exerciseId = req.body.exerciseId;
    var folderId = req.body.folderId;
    var timePracticed = req.body.timePracticed;
    var newBpm = req.body.newBpm;
    var today = new Date();

    console.log("Route: /saveExerciseInfo : Ex ID: %s, Folder ID: %s, Time Practiced: %s, BPM: %s",
                        exerciseId, folderId, timePracticed, newBpm);

    // The input time string is hh:mm:ss. Split the string on ":".
    var timeSplitArray = timePracticed.split(":");

    var timePracticedInSeconds = parseInt(timeSplitArray[0]) * 3600 + parseInt(timeSplitArray[1]) * 60 + parseInt(timeSplitArray[2]);

    console.log("Time parsed into seconds: %s", timePracticedInSeconds);

    updateExercise(req, res, next, exerciseId, folderId, timePracticedInSeconds, newBpm, today);
}

function updateExercise(req, res, next, exerciseId, folderId, timePracticedInSeconds, newBpm, today) {
    
    mongoModel.Exercise.findById(new ObjectId(exerciseId.toString()), function (err, exerciseDoc) {
        if (err) {
            console.log("Error in finding exercise ID: %s", exerciseId);
        }
        else {
            exerciseDoc.lastUpdated = today;
            exerciseDoc.lastPracticeTime = timePracticedInSeconds;
            exerciseDoc.totalPracticeTime = exerciseDoc.totalPracticeTime + timePracticedInSeconds;

            // If there is a practice history, then check if this is a practice session on the same day as last session.

            if (exerciseDoc.history.length > 0) {

                var lastPracticeSession = exerciseDoc.history[exerciseDoc.history.length - 1];

                var lastPracticeSessionDateString = lastPracticeSession.date.toISOString().split("T")[0];
                var currentPracticeSessionDateString = today.toISOString().split("T")[0];

                console.log("Last Practice Session Date: %s", lastPracticeSessionDateString);
                console.log("Current Practice Session Date: %s", currentPracticeSessionDateString);

                // If the last practice date was same as new practice date, then we edit the last history.
                // Else we create a new history entry.

                if (lastPracticeSessionDateString === currentPracticeSessionDateString) {
                    console.log("Editing the last practice session as the new session is on the same day ");

                    lastPracticeSession.practiceTime += timePracticedInSeconds;
                    lastPracticeSession.bpm = newBpm;
                }
                else {
                    console.log("Adding the first practice session.");

                    var practiceSession = {
                        date: today,
                        practiceTime: timePracticedInSeconds,
                        bpm: newBpm
                    };

                    exerciseDoc.history.push(practiceSession);
                }
            }
            else {
                // Add a new practice session.

                console.log("Adding a new practice session");

                var practiceSession = {
                    date: today,
                    practiceTime: timePracticedInSeconds,
                    bpm: newBpm
                };

                exerciseDoc.history.push(practiceSession);
            }

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
                    
                    if (folderId === "root") {
                        console.log("Folder ID is undefined")
                        res.send(totalExercisePracticeTimeString);
                    }
                    else {
                        console.log("Folder ID is not undefined. Updating folder")

                        updateFolder(req, res, next, folderId, totalExercisePracticeTimeString, timePracticedInSeconds, today);

                    }
                }
            });
        }
    });   
}

function updateFolder(req, res, next, folderId, totalExercisePracticeTimeString, timePracticedInSeconds, today) {
    mongoModel.Folder.findById(new ObjectId(folderId.toString()), function (err, folderDoc) {
        if (err) {
            console.log("Error in finding folder ID: %s", folderId);
        }
        else {
            folderDoc.lastUpdated = today;
            folderDoc.lastPracticeTime = timePracticedInSeconds;
            folderDoc.totalPracticeTime = folderDoc.totalPracticeTime + timePracticedInSeconds;

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