var express = require('express');
var sessions = require('client-sessions');
var queryString = require('querystring');
var mongoModel = require('../mongo/models');

var router = express.Router();

router.use(sessions( {
    cookieName: 'session',
    secret: 'asdkjbasfkjnwefoqiwer',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

router.get('/', function(req, res, next) {
    if(req.session && req.session.user) {
        mongoModel.UserModel.findOne({ email: req.session.user.email }, function(err, user) {
            if(!user) {
                req.session.reset();
                res.redirect('..');
            }
            else {
                res.locals.user = user;
                res.render('home', { title: 'Home' });
            }
        });
    }
    else {
        res.redirect('..');
    }
});

module.exports = router;