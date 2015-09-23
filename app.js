var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var flash = require('connect-flash');
var mongoModel = require('./mongo/models');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/musibuk');

// Define all the routes.
var routes = require('./routes/index');
var home = require('./routes/home');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');
var createexercise = require('./routes/createexercise');
var createfolder = require('./routes/createfolder');
var folder = require('./routes/folder');
var exercise = require('./routes/exercise');
var setExerciseBpm = require('./routes/setExerciseBpm');

var app = express();

function requireLogin(req, res, next) {
    if(!req.user) {
        res.redirect('/');
    }
    else {
        next();
    }
}

function handleSession(req, res, next) {
    if(req.session && req.session.user) {
        console.log('app.js Session details: %s', req.session.user);

        mongoModel.User.findOne({ email: req.session.user.email }, function(err, user) {
            if(user) {
                req.user = user;
                delete req.user.password;
                req.session.user = user;
                res.locals.user = req.user;
            }
            next();     // Pass the control to the next handler.
        });
    }
    else {
        next();
    }
}

// view engine setup. Use EJS over Jade. That way I can use HTML.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Third Party Middleware

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Session details to be used.
app.use(sessions( {
    cookieName: 'session',
    secret: 'asdkjbasfkjnwefoqiwer',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

// Use the defined middleware for session handling.
app.use(handleSession);

app.use(flash());

// These routes don't require Login. 
// They have to be used first so that they get the first dibs in serving the request
// and don't have to use requireLogin middleware.
app.use('/', routes);
app.use('/login', login);
app.use('/register', register);

// User defined middleware
app.use(requireLogin);

// All other routes here on are protected and need requireLogin to be invoked first 
// if the req is not authorized.
app.use('/home', home);
app.use('/logout', logout);
app.use('/createexercise', createexercise);
app.use('/createfolder', createfolder);
app.use('/folder', folder);
app.use('/exercise', exercise);
app.use('/setExerciseBpm', setExerciseBpm);

// ---------------- ERROR HANDLERS ---------------- //

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
