var express = require('express');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

var router = express.Router();

/**
 * Create a folder in collection - 'exercise' on a Post request.
 */
router.post('/', function(req, res, next) {

    console.log('Folder Name: %s and stack: %s', req.body.folderName, req.body.stackName);

    var today = new Date();
    var folder = new mongoModel.Folder({ 
        user_id:            req.user.email,
        name:               req.body.folderName,
        entryType:          "folder",
        stack:              req.body.stackName, 
        exercises:          [],
        createdTime:        today,
        lastUpdated:        today,
        lastPracticeTime:   0,
        totalPracticeTime:  0,
        history:            []
    });

    folder.save(function(err, folder) {
        if(err) {
            var errorMsg = "There was an error in creating the folder";

            if(err.code === 11000) {
                errorMsg = "That folder name is already taken. Choose a differnet name.";
            }

            console.log("%s. Folder: %s", errorMsg, req.body.folderName);
        }
        req.flash('errorMsg', errorMsg);
        res.redirect('../home');
    });
});

module.exports = router;