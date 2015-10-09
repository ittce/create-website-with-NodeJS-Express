var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
//var cookieSession = require('cookie-session');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var logger = require('morgan');
var port = process.env.PORT || 3000;
var app = express();
var dburl = 'mongodb://localhost/imooc';

mongoose.connect(dburl);

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(cookieParser());
app.use(session({
  secret: 'imooc',
  store: new mongoStore({
    url: dburl,
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: true
}));

if ('development' === app.get('env')) {
  app.set('showStackError', true);
  app.use(logger(':method :url :status'));
  app.locals.pretty = true;
  mongoose.set('debug', true);
}

require('./config/routes')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started at' + port);


