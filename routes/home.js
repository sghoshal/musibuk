var express = require('express');
var mongoose = require('mongoose');

var mongoModel = require('../mongo/models');

var router = express.Router();
var result = [];

/**
 * Render the home page.
 */
function renderHomePage(req, res, next) {
    console.log("Rendering Home Page with results: %s", result );

    res.render('home', { title: 'Home',
                         result: result,
                         errorMsg: req.flash('errorMsg') } );
}

/**
 * GET Handler - Fetch all exercises and folders info for the logged in user.
 */
function fetchUserInfoAndRenderHomePage(req, res, next) {
    result = [];
    mongoModel.Exercise.find({ 'user_id': req.user.email, "folderId": "root" }, onFetchAllExercises);

    function onFetchAllExercises(err, allExercises) {
        if(err) {
            console.log('home.js: Could not fetch all exercises.');
        }
        else {
            result = result.concat(allExercises);

            // Fetch all the folders now.
            mongoModel.Folder.find({ 'user_id': req.user.email }, onFetchAllFolders );
        }
    }

    function onFetchAllFolders(err, allFolders) {
        if(err) {
            console.log('home.js: Could not fetch all folders.');
        }
        else {
            result = result.concat(allFolders);

            // Here we can call renderHomePage with req, res, next because
            // those variables are parameters of the outer function. During
            // callback execution, this function still has reference to
            // req, res, next.
            renderHomePage(req, res, next);
        }
    }
}

router.get('/', fetchUserInfoAndRenderHomePage);

module.exports = router;