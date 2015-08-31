var express = require('express');
var csrf = require('csurf');
var mongoose = require('mongoose');
var mongoModel = require('../mongo/models');

var router = express.Router();

router.use(csrf());

var result = [];

function renderHomePage(req, res, next) {
    console.log("Rendering Home Page with results: %s", result );

    res.render('home', { title: 'Home' , 
                         csrfToken: req.csrfToken(),
                         result: result,
                         errorMsg: req.flash('errorMsg') } );
}

router.get('/', fetchUserInfoAndRenderHomePage);

function fetchUserInfoAndRenderHomePage(req, res, next) {
    result = [];
    mongoModel.Exercise.find({ 'user_id': req.user.email }, onFetchAllExercises);

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
            // those variables are in the outer function.l
            renderHomePage(req, res, next);
        }
    }
}

module.exports = router;