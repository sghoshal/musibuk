var express = require('express');
var router = express.Router();

function redirect_to_home (req, res){
    console.log("Session started. Redirecting user to home page");
    res.writeHead(301, {Location: '/home'});
    res.end();
}

router.post('/', function(req, res, next) {
    redirect_to_home(req, res, next);
});

module.exports = router;