var express = require('express');
var mongoose = require('mongoose');

var mongoModel = require('../mongo/models');
var timeUtil = require('../utils/time_util') 

var router = express.Router();

function fetchFolderExercises(req, res, next) {
    var folderId = mongoose.Types.ObjectId(req.params.folderId.toString());
    getFolderFromIdAndRenderPage(req, res, next, folderId);
}

function getLastWeekHistory(history) {

    var result = [];
    var today = new Date();
    var dateWeek = new Date();
    var historyIndex = history.length - 1;

    // Log the history argument date.
    // console.log("The history argument: ");
    // for(var i = 0; i < history.length; i++) {
    //     var utcDate = timeUtil.convertDateToUtc(history[i].date);
    //     console.log("%s-%s-%s", utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate());
    // }
    

    for (var i = 0; i < 7; i++) {
        dateWeek.setDate(today.getDate() - i);
        var currentHistoryElement = history[historyIndex];

        if (typeof currentHistoryElement === 'undefined' || currentHistoryElement === null) {
            console.log("Current History Element is undefined. Creating a dummy history element.")
            currentHistoryElement = {
                date:           new Date(dateWeek),
                practiceTime:   0
            }
        }

        // NOTE: Mongo stores date in UTC but returns in the client's timezone. We want to convert to UTC for comparison.
        var utcConvertedHistoryDate = timeUtil.convertDateToUtc(currentHistoryElement.date);

        // console.log("Date Week: Today minux %s = %s", i, timeUtil.getFullDateString(dateWeek));
        // console.log("Current History Index = %s. Is Current Date Week same as Current history at historyIndex? Comparing in UTC ((%s) and (%s) = %s ", 
        //                 historyIndex, dateWeek, currentHistoryElement.date, timeUtil.isSameDate(dateWeek, utcConvertedHistoryDate));

        // Now check if the current date of week and current history date (UTC) are equal. If so, we have a practice session on this date week.
        if ((historyIndex >= 0) && timeUtil.isSameDate(dateWeek, utcConvertedHistoryDate)) {
            console.log("Practice session found on date - %s", dateWeek.getDate().toString());

            var shortDateString = timeUtil.getShortDateString(currentHistoryElement.date);

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
                shortDateString: timeUtil.getShortDateString(dateWeekClone),
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
                                       totalPracticeTime: timeUtil.convertSecondsToTimeString(0),
                                       errorMsg: req.flash('errorMsg'),
                                       lastWeekHistory: lastWeekHistory });
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
                                       lastPracticeTime: timeUtil.convertSecondsToTimeString(folder.lastPracticeTime),
                                       totalPracticeTime: timeUtil.convertSecondsToTimeString(folder.totalPracticeTime),
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