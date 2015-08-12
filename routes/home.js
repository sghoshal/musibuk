var express = require('express');
var router = express.Router();

var queryString = require('querystring')

router.get('/', function(req, res, next) {
    res.render('home', { title: 'Home' });
});

module.exports = router;

// /* GET Home page of user */
// router.post('/', function(req, res, next) {
//   if( req.method == 'POST') {

//     console.log('Recevied post request');
//     var body = '';
//     req.on('data', function(data) {
//         body += data;

//         // TODO: Kill the connection if the body is too big?
//     });

//     req.on('end', function() {
//         var post = queryString.parse(body);

//         var emailString = post['email'];
//         var passwordString = post['password'];

//         res.render('me', {email: emailString, password: passwordString})
//     });
//   }
// });