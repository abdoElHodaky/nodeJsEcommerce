var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
//app.listen(process.env.PORT || 3000,console.log)
//var http = require('http');
//var server = http.createServer(app);
//server.listen(process.env.PORT || "3000")
var io=require('socket.io')(app)
var index = require('./routes/controll')(io);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
flash=require('express-flash')
validator=require('express-validator')
app.use(flash())
app.use(validator())
session=require('express-session')
app.use(session({
  saveUninitialized:true,
  resave:false,
  secret:require('crypto').Hmac("sha1",(Math.random()*1000000000000).toString()).update('sess').digest('base64'),
  cookieName:"sess",
  cookieSecure:true
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(process.env.PORT || '3000',console.log)
module.exports = app;
