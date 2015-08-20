var express = require('express');
var csrf = require('csurf');

var router = express.Router();

// Use csrf for Cross-Site Request Forgery Protection
// It generates a new token every time the register page is loaded.
// The form submitted should have this unique token.

router.use(csrf());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Musibuk - Login', csrfToken: req.csrfToken() });
});

module.exports = router;