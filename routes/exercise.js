var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

var router = express.Router();

var result = [];

function renderPage(req, res, next, exercise, folderName, folderId) {
    console.log('Rendering page now. Ex Name: %s, Folder Name: %s', exercise.name, folderName);
    res.render('exercise', {
        "exerciseId": exercise._id.toString(),
        "exerciseName": exercise.name,
        "createdDate": exercise.createdTime,
        "lastPracticed": exercise.lastUpdated,
        "bpm": exercise.bpm,
        "folderName": folderName,
        "folderId": folderId
    });
}

router.get('/:exerciseId', function(req, res, next) {
    console.log("In Exercise route");
    var exerciseId = mongoose.Types.ObjectId(req.params.exerciseId.toString());

    mongoModel.Exercise.find( { "user_id": req.user.email, _id: exerciseId }, function(err, exerciseDoc) {
        if(err) {
            console.log("Error in fetching exercise with ID: %s", exerciseId);
            next(err);
        }
        else {
            var exercise = exerciseDoc[0];
            console.log('Loading exercise page document: %s', exercise);

            if(exercise.folderId !== 'root') {
                console.log("Folder is not root. Is it? Folder ID: %s", exercise.folderId);
                var folderId = mongoose.Types.ObjectId(exercise.folderId.toString());
            
                mongoModel.Folder.find({ _id: folderId, "user_id": req.user.email }, function(err, folderDocument) {
                    if(err) {
                        console.log("Error in fetching folder: %s", folderId)
                        next(err);
                    }
                    else {
                        var folderName = folderDocument[0].name;
                        console.log('The folder name: %s', folderName);
                        renderPage(req, res, next, exercise, folderName, folderDocument[0]._id.toString());
                    }
                });  
            }
            else {
                console.log("Folder ID = root");
                renderPage(req, res, next, exercise);
            }
        }
    });
});

module.exports = router;