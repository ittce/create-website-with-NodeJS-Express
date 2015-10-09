var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

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
  app.get('/user/list', User.signinRequired, User.adminRequired, User.list);

  //Movie
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie/list', Movie.list);
  app.get('/admin/movie', Movie.new);
  app.post('/admin/movie/new', Movie.save);
  app.get('/admin/movie/update/:id', Movie.update);
  app.delete('/admin/list', Movie.del);

  // Comment
  app.post('/admin/comment', User.signinRequired, Comment.save);

  // Category
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.feature);
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
};
