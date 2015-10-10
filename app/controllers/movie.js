var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

//detail page
exports.detail = function (req, res) {
  var id = req.params.id;

  Movie.findById(id, function (err, movie) {
    if (err) {
      console.log(err);
    }

    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function (err, comments) {
        console.log(comments);
        res.render('detail', {
          title: 'imooc' + movie.title,
          movie: movie,
          comments: comments
        });
      });
  });
};

//list page
exports.list = function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      cosole.log(err);
    }

    res.render('list', {
      title: 'imooc 列表页',
      movies: movies
    });
  });
};

//admin new page
exports.new = function (req, res) {
  Category.fetch(function (err, categories){
    res.render('admin', {
      title: 'imooc admin page',
      categories: categories,
      movie: {}
    });
  });
};

//admin poster
exports.savePoster = (req, res, next) => {
  var posterData = req.files.uploadPoster;
  var filePath = posterData.path;
  var originalFileName = posterData.originalFilename;
  console.log(posterData);

  if (originalFileName) {
    fs.readFile(filePath, (err, data) => {
      var timestamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timestamp + '.' + type;
      var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);
      console.log(__dirname);
      fs.writeFile(newPath, data, (err) => {
        req.body.movie.poster = poster;
        next();
      });
    });
  } else {
    next();
  }
};

//admin post movie
exports.save = function (req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;

  if (req.poster) {
    movieObj.poster = req.poster;
  }
  if (typeof(id) !== 'undefined') {
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err);
      }

      _movie = _.extend(movie, movieObj);
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err);
        }

        res.redirect('/movie/' + movie._id);
      });
    });
  } else {
    _movie = new Movie(movieObj);

    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;
    _movie.save(function (err, movie) {
      if (err) {
        console.log(err);
      }
      if (categoryName) {
        category = new Category({
          name: categoryName,
          movies: [movie._id]
        });
        category.save(function(err, category) {
          movie.category = category._id;
          movie.save(function (err, movie) {
            res.redirect('/movie/' + movie._id);
          });
        });
      } else if(categoryId) {
        Category.findById(categoryId, function (err, category) {
          if (err) {
            console.log(err);
          }
          category.movies.push(movie._id);
          category.save(function(err, category){
            res.redirect('/movie/' + movie._id);
          });
        });
      }
    });
  }
};

//admin update movie
exports.update =  function (req, res) {
  var id = req.params.id;

  if (id) {
    Movie.findById(id, function (err, movie) {
      Category.find({}, function (err, categories){
        res.render('admin', {
          title: '后台更新页',
          movie: movie,
          categories: categories
        });
      });
    });
  }
};

//list delete movie
exports.del = function (req, res) {
  var id = req.query.id;

  if (id) {
    Movie.remove({_id: id}, function (err, movie) {
      if (err) {
        console.log(err);
      } else {
        res.json({success: 1});
      }
    });
  }
};
