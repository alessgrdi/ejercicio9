var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');

var isFromSession = false;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
//app.use(session());
app.use(session({
            name: 'quiz-2015', // configuración de la cookie
           secret: 'huertix',
            resave: true,       // Forces the session to be saved back to the session store
            rolling: true,      // Force a cookie to be set on every response. This resets the expiration date.
            saveUninitialized: false,       //
            cookie: { maxAge: 120000}  // Tiempo de la sesion, expiración de la cookie -> 30000 = 30s.
            }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

// Helpers dinamicos:
app.use(function(req, res, next) {

  req.session.touch();
  res.locals.session = req.session;

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  if(req.session.user){
        isFromSession = true;
        console.log("en sesión");

    }else{
        if(isFromSession){
            isFromSession = false;
            console.log("fuera de la sesión");
            var err = new Error('Sesión Finalizada');
           err.status = 1001;
            next(err);
        }
     }

  // Hacer visible req.session en las vistas
  //res.locals.session = req.session;
  next();
});

app.use('/', routes);

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
