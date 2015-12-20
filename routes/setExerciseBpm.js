var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

var ObjectId = require('mongodb').ObjectID;
var router = express.Router();

/**
 * POST Handler - Save exercsise BPM and use return HTML for doing AJAX page update.
 */
router.post('/', function(req, res, next) {
    console.log("Req: %s %s", req.body.bpm, req.body.exerciseId);

    var newBpm = req.body.bpm;
    var exerciseIdString = req.body.exerciseId;

    mongoModel.Exercise.findById(new ObjectId(exerciseIdString.toString()), function (err, exerciseDoc) {
        if (err) {
            console.log("Error in finding exercise ID: %s", exerciseIdString);
        }
        else {
            exerciseDoc.bpm = newBpm;
            exerciseDoc.save(function(err) {
                if(err) {
                    console.log("Error in saving exercise: %s with new bpm: %s", exerciseIdString, newBpm);
                }
                else {
                    var returnHtml = '<p id="bpmText">Current BPM <span id="currentBpmVal">' + newBpm + '</span></p>';
                    res.send(returnHtml);
                }
            });
        }
    });
});

module.exports = router;