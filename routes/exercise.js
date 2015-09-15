var express = require('express');

var router = express.Router();

router.get('/:exerciseId', function(req, res, next) {
    console.log("In Exercise route");
    res.render('exercise');
});

module.exports = router;