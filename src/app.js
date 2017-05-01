var path = require('path');

var express = require('express');
var parseurl = require('parseurl');
var bodyParser = require('body-parser');
var session = require('express-session');
var favicon = require('serve-favicon');

global.console = require('winston');
console.level = 'debug';

var app = express();

// Use express-session middleware for express
app.use(session({
  secret: 'dsHhCAyYdqYAu25Km5EtkLMZm7XD',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
})); ;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static('../bower_components'));

var login = require('./routes/login');
app.use('/', login);

var api = require('./routes/api');
app.use('/api/', api);


app.get('*', function(req, res) {
    res.redirect('/');
});
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
