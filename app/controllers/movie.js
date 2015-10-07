var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');

//detail page
exports.detail = function (req, res) {
  var id = req.params.id;

  Movie.findById(id, function (err, movie) {
    if (err) {
      console.log(err);
    }

    Comment.find({movie: id})
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
  res.render('admin', {
    title: 'imooc admin page',
    movie: {
      title: '',
      doctor: '',
      country: '',
      language: '',
      poster: '',
      flash: '',
      year: '',
      summary: ''
    }
  });
};

//admin post movie
exports.save = function (req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;

  console.log(typeof(id), id);
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
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    });

    _movie.save(function (err, movie) {
      if (err) {
        console.log(err);
      }

      res.redirect('/movie/' + movie._id);
    });
  }
};

//admin update movie
exports.update =  function (req, res) {
  var id = req.params.id;

  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: '后台更新页',
        movie: movie
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
