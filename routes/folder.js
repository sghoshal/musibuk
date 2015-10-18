var express = require('express');
var mongoose = require('mongoose');

var mongoModel = require('../mongo/models');

var router = express.Router();

function fetchFolderExercises(req, res, next) {
    var folderId = mongoose.Types.ObjectId(req.params.folderId.toString());
    getFolderFromIdAndRenderPage(req, res, next, folderId);
}

function isSameDate(date1, date2) {

    return ((date1.getFullYear() === date2.getFullYear()) &&
            (date1.getMonth() === date2.getMonth()) &&
            (date1.getDate() === date2.getDate()));
}

function getLastWeekHistory(history) {

    var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    var result = [];
    var today = new Date();
    var dateWeek = new Date();
    var historyIndex = history.length - 1;

    for (var i = 0; i < 7; i++) {
        dateWeek.setDate(today.getDate() - i);

        // console.log("Date Week -%s: date: %s", i, 
        //     dateWeek.getFullYear().toString() + dateWeek.getMonth().toString() + dateWeek.getDate().toString());

        if ((historyIndex >= 0) && isSameDate(dateWeek, history[historyIndex].date)) {
            console.log("Practice session found on date - %s", dateWeek.getDate().toString());

            var shortDateString = monthNames[history[historyIndex].date.getMonth()] + " " +
                                  history[historyIndex].date.getDate();

            result.push({
                shortDateString: shortDateString, 
                practiceTime: history[historyIndex].practiceTime
            });

            historyIndex--;
        }
        else {
            console.log("No practice session on this Date: %s", dateWeek.getDate().toString());

            var dateWeekClone = new Date(dateWeek.getTime());
            
            result.push({
                shortDateString: monthNames[dateWeekClone.getMonth()] + " " + dateWeekClone.getDate(),
                practiceTime: 0
            });
        }
    }

    return result;
}

function getFolderFromIdAndRenderPage(req, res, next, folderId) {
    mongoModel.Folder.find({_id: folderId }, function(err, folderDocument) {
        if(err) {
            console.log("Error in fetching ")
            next(err);
        }
        else {
            console.log('Loading folders page with folder: %s', folderDocument[0]);
            var lastWeekHistory = getLastWeekHistory(folderDocument[0].history);

            console.log("Last week history: %s", JSON.stringify(lastWeekHistory));

            renderPage(req, res, next, folderDocument[0], lastWeekHistory);
        }
    });
}

function renderPage(req, res, next, folder, lastWeekHistory) {
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
                                       errorMsg: req.flash('errorMsg'),
                                       lastWeekHistory: lastWeekHistory });
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
                                        var lastWeekHistory = getLastWeekHistory(folder.history);

                                        console.log("Last week history: %s", JSON.stringify(lastWeekHistory));

                                        renderPage(req, res, next, folder, lastWeekHistory);
                                    }
                                });
        }
    });        
}

router.get('/:folderId', fetchFolderExercises);
router.post('/', createExerciseInFolder);

module.exports = router;