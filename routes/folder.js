var express = require('express');
var mongoose = require('mongoose');

var mongoModel = require('../mongo/models');

var router = express.Router();

function fetchFolderExercises(req, res, next) {
    var folderId = mongoose.Types.ObjectId(req.params.folderId.toString());
    getFolderFromIdAndRenderPage(req, res, next, folderId);
}

function getFolderFromIdAndRenderPage(req, res, next, folderId) {
    mongoModel.Folder.find({_id: folderId }, function(err, folderDocument) {
        if(err) {
            console.log("Error in fetching ")
            next(err);
        }
        else {
            console.log('Loading folders page with folder: %s', folderDocument[0]);
            renderPage(req, res, next, folderDocument[0]);
        }
    });
}

function renderPage(req, res, next, folder) {
    var folderExerciseIdList = folder.exercises;

    console.log("Exercises to be fetched: %s", folderExerciseIdList );

    if(typeof folderExerciseIdList === 'undefined' || folderExerciseIdList.length === 0) {
        res.render('folder', { title: 'Musibuk',
                                       folderName: folder.name,
                                       folderId: folder._id,
                                       exercises: [],
                                       lastPracticed: "Never",
                                       lastPracticeTime: 0,
                                       totalPracticeTime: 0,
                                       errorMsg: req.flash('errorMsg') });
    }
    else {
        mongoModel.Exercise.find( {"_id": { $in: folderExerciseIdList } }, function(err, exercises) {
            if(err) {
                console.log("Error fetching Exercise documents for input: %s", folderExerciseIdList);
                next();
            }
            else {
                res.render('folder', { title: 'Musibuk',
                                       folderName: folder.name,
                                       folderId: folder._id,
                                       exercises: exercises,
                                       lastPracticed: folder.lastUpdated,
                                       lastPracticeTime: folder.lastPracticeTime,
                                       totalPracticeTime: folder.totalPracticeTime,
                                       errorMsg: req.flash('errorMsg') });
            }
        });
    }
}  

function createExerciseInFolder(req, res, next) {

    console.log('Creating Exercise - %s in Folder: %s with Notes: %s', 
        req.body.exerciseInFolderName, req.body.folderName, req.body.exerciseInFolderNotes);
    
    var folderId = req.body.folderId;

    var exercise = new mongoModel.Exercise({
        user_id:        req.user.email,
        name:           req.body.exerciseInFolderName,
        entryType:      "exercise",
        notes:          req.body.exerciseInFolderNotes,
        bpm:            80,
        folderId:       folderId,
        createdTime:    new Date(),
        lastUpdated:    new Date(),
        timePracticed:  0,
        history:        []
    });
        
    exercise.save(function (err, exercise) {
        if(err) {
            var errorMsg = 'Could not save the exercise to DB. Try again!';
            
            if(err.code === 11000) {
                errorMsg = 'That exercise name is already taken in this folder. Try another!';
            }

            req.flash('errorMsg', errorMsg);
            res.redirect(req.get('referer'));
        }
        else {
            console.log("Created exercise - %s. Now adding this exercise entry to folder", exercise);

            var exerciseId = exercise._id;

            mongoModel.Folder.findOneAndUpdate(
                                { _id: folderId },
                                { $push: {exercises: exerciseId }},
                                { safe: true, upsert: true, new: true },
                                function(err, folder) {
                                    if(err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log( "Successfully updated. Here is the updated folder: %s", folder );
                                        renderPage(req, res, next, folder);
                                    }
                                });
        }
    });        
}

router.get('/:folderId', fetchFolderExercises);
router.post('/', createExerciseInFolder);

module.exports = router;