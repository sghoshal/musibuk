var express = require('express');
var mongoose = require('mongoose');

var mongoModel = require('../mongo/models');
var timeUtil = require('../utils/time_util')

var router = express.Router();

var result = [];

function isSameDate(date1, date2) {

    return ((date1.getFullYear() === date2.getFullYear()) &&
            (date1.getMonth() === date2.getMonth()) &&
            (date1.getDate() === date2.getDate()));
}

function getLastWeekHistory(history) {
    var result = [];
    var today = new Date();
    var dateWeek = new Date();
    var historyIndex = history.length - 1;
    var result = [];
    
    // for (var i = 0; i < history.length; i++) {
    //     console.log("History %s: date: %s", i, 
    //         history[i].date.getFullYear().toString() + history[i].date.getMonth().toString() + history[i].date.getDate().toString())
    // }

    for (var i = 0; i < 7; i++) {
        dateWeek.setDate(today.getDate() - i);

        var currentHistoryElement = history[historyIndex];
        
        if (typeof currentHistoryElement === 'undefined' || currentHistoryElement === null) {
            console.log("Current History Element is undefined. Creating a dummy history element.")
            currentHistoryElement = {
                date:           new Date(dateWeek),
                bpm:            0,
                practiceTime:   0
            }
        }

        var utcConvertedHistoryDate = timeUtil.convertDateToUtc(currentHistoryElement.date);

        // console.log("Date Week - %s: date: %s", i, 
        //     dateWeek.getFullYear().toString() + dateWeek.getMonth().toString() + dateWeek.getDate().toString());
        
        // console.log("Is %s / %s = Same Date? %s", dateWeek, utcConvertedHistoryDate, 
        //     isSameDate(dateWeek, utcConvertedHistoryDate));

        var shortDateString = timeUtil.getShortDateString(dateWeek);
        
        if ((historyIndex >= 0) && isSameDate(dateWeek, utcConvertedHistoryDate)) {
            console.log("Practice session found on date - %s", dateWeek.getDate().toString());

            result.push({
                bpm: currentHistoryElement.bpm, 
                time: currentHistoryElement.practiceTime,
                shortDateString: shortDateString
            });

            historyIndex--;
        }
        else {
            console.log("No practice session on this Date: %s", dateWeek.getDate().toString());

            result.push({
                bpm: 0, 
                time: 0,
                shortDateString: shortDateString
            });
        }
    }

    for(var i = 0; i < result.length; i++) {
        console.log("Exercise Analytics data: BPM/Time/Date = %s/%s/%s", 
            result[i].bpm, result[i].time, result[i].shortDateString);
    }

    return result;
}


function renderPage(req, res, next, exercise, totalPracticeTimeString, folderName, folderId, lastWeekHistory) {
    console.log('- exercise.js: Rendering page now. Ex Name: %s, Folder Name: %s, Folder ID: %s', 
                    exercise.name, folderName, folderId);

    res.render('exercise', {
        "exerciseId": exercise._id.toString(),
        "exerciseName": exercise.name,
        "createdDate": exercise.createdTime,
        "lastPracticed": exercise.lastUpdated,
        "totalTimePracticed": totalPracticeTimeString,
        "bpm": exercise.bpm,
        "history": exercise.history,
        "notes": exercise.notes,
        "folderName": folderName,
        "folderId": folderId,
        "lastWeekHistory": lastWeekHistory
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

            var totalPracticeTimeString = timeUtil.convertSecondsToTimeString(exercise.totalPracticeTime);

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

                        var lastWeekHistory = getLastWeekHistory(exercise.history);
                        renderPage(req, res, next, exercise, totalPracticeTimeString, folderName, folderDocument[0]._id.toString(), lastWeekHistory);
                    }
                });  
            }
            else {
                console.log("Folder ID = root. Folder ID: %s", exercise.folderId);
                
                var lastWeekHistory = getLastWeekHistory(exercise.history);
                renderPage(req, res, next, exercise, totalPracticeTimeString, null, exercise.folderId, lastWeekHistory);
            }
        }
    });
});

module.exports = router;