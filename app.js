// require node modules
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
// set up connection to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/yourguide_development');

// require controllers for setting routes
var main = require('./controllers/index');
var users = require('./controllers/users');
var tours = require('./controllers/tours');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session initialization
app.use(session({
  secret: "yourguide",
  resave: false,
  saveUninitialized: true
}));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
})

// set main routes for index controller
app.get('/', main.index);
app.post('/', main.signin);
app.post('/signout', main.signout);

// set routes for user controller
app.get('/signup', users.newUser);
app.post('/signup', users.add);

app.get('/dashboard', users.showDash);

app.get('/users/:id', users.getUser);
app.put('/users/:id', users.update);
app.delete('/users/:id', users.destroy);

// set routes for tour controller
app.get('/tours/new', tours.newTour);
app.get('/tours/show', tours.showTour);
app.post('/tours/new', tours.add);
app.get('/tours/:id', tours.getTour);
app.put('/tours/:id', tours.update);
app.delete('/tours/:id', tours.destroy);

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
