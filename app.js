var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var Movie = require('./models/movie');
var User = require('./models/user');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc');

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(cookieParser());
app.use(cookieSession({
  secret: 'imooc'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started at' + port);

//index page
app.get('/', function (req, res) {
  console.log('user insession : ');
  console.log(req.session.user);
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
    }

    res.render('index', {
      title: 'imooc 首页',
      movies: movies
    });
  });
});

//signup
app.post('/user/signup', function (req, res) {
  var _user = req.body.user;

  User.find({name: _user.name}, function (err, user) {
    if (err) {
      console.log(err);
    }

    if (user.length > 0 ){
      return res.redirect('/');
    } else {
      var user = new User(_user);
      user.save(function (err, user) {
        if (err) {
          console.log(err);
        }

        res.redirect('/admin/userlist');
      })
    }
  });
});

//signin
app.post('/user/signin', function (req, res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;

  User.findOne({name: name}, function (req, res) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err);
      }

      if(isMatch) {
        req.session.user = user;
        return res.redirect('/');
      } else {
        console.log('password is not matched');
      }
    });
  });
});

//detail page
app.get('/movie/:id', function (req, res) {
  var id = req.params.id;

  Movie.findById(id, function(err, movie) {
    if (err) {
      console.log(err);
    }

    res.reder('detail', {
      title: 'imooc' + movie.title,
      movie: movie
    })
  });


})