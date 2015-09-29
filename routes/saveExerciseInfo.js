var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

var ObjectId = require('mongodb').ObjectID;

var router = express.Router();

router.post('/', function(req, res, next) {

    var exerciseId = req.body.exerciseId;
    var timePracticed = req.body.timePracticed;

    console.log("Req: %s %s", timePracticed, exerciseId);

    var timeSplitArray = timePracticed.split(":");
    var timeInSeconds = parseInt(timeSplitArray[0]) * 3600 + parseInt(timeSplitArray[1]) * 60 + parseInt(timeSplitArray[2]);

    console.log("Time parsed into seconds: %s", timeInSeconds);

    var today = new Date();
    
    mongoModel.Exercise.findById(new ObjectId(exerciseId.toString()), function (err, exerciseDoc) {
        if (err) {
            console.log("Error in finding exercise ID: %s", exerciseIdString);
        }
        else {
            exerciseDoc.lastUpdated = today;
            exerciseDoc.timePracticed = timeInSeconds;

            exerciseDoc.save(function(err) {
                if(err) {
                    console.log("Error in saving exercise: %s", exerciseId);
                }
                else {
                    
                }
            });
        }
    });

    // mongoModel.Exercise.findById(new ObjectId(exerciseIdString.toString()), function (err, exerciseDoc) {
    //     if (err) {
    //         console.log("Error in finding exercise ID: %s", exerciseIdString);
    //     }
    //     else {
    //         exerciseDoc.bpm = newBpm;
    //         exerciseDoc.save(function(err) {
    //             if(err) {
    //                 console.log("Error in saving exercise: %s with new bpm: %s", exerciseIdString, newBpm);
    //             }
    //             else {
    //                 var returnHtml = '<p id="bpmText">BPM: ' + newBpm + '</p>';
    //                 res.send(returnHtml);
    //             }
    //         });
    //     }
    // });    
});

module.exports = router;