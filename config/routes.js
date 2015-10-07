var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');

module.exports = function (app) {

//pre handle user
  app.use(function (req, res, next) {
    var _user = req.session.user;

    app.locals.user = _user;

    return next();
  });

  //Index
  app.get('/', Index.index);

  //User
  app.post('/user/signup', User.signup);
  app.post('/user/signin', User.signin);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  app.get('/logout', User.logout);
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

  //Movie
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie/list', Movie.list);
  app.get('/admin/movie/new', Movie.new);
  app.post('/admin/movie', Movie.save);
  app.get('/admin/movie/update/:id', Movie.update);
  app.delete('/admin/list', Movie.del);

  // Comment
  app.post('/admin/comment', User.signinRequired, Comment.save);
};