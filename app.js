var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var mongoModel = require('./mongo/models');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');

// Define all the routes.
var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

// Middleware for session handling.
app.use(function(req, res, next) {
    if(req.session && req.session.user) {
        console.log('app.js App details: %s', req.session.user);

        mongoModel.UserModel.findOne({ email: req.session.user.email }, function(err, user) {
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
});

// All routes.
app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/home', home);
app.use('/register', register);
app.use('/logout', logout);

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
