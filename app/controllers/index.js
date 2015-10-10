var mongoose = require('mongoose');
var Movie = require('../models/movie');
var Category = require('../models/category');

//index page
exports.index = (req, res) => {
  Category
    .find({})//把所有类别查出来
    .populate({
      path: 'movies',
      select: 'title poster',
      options : {limit : 5}
    }) //通过
    .exec((err, categories) => {
      if (err) {
        console.log(err);
      }

      res.render('index',  {
        title : 'imooc 首页',
        categories: categories
      })
    });
};

//search page
exports.search = (req, res) => {
  //if (!req.query.catId) {
  //  return res.redirect('/');
  //}
  var catId = req.query.cat;
  var page = parseInt(req.query.p, 10) || 0;
  const COUNT = 2;
  var q = req.query.q;
  var index = page * COUNT;

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'movies',
        select: 'title poster'
        //options: {limit: 2, skip: index}
      })
      .exec((err, categories) => {
        if (err) {
          console.log(err);
        }
        var category = categories[0] || {};
        var movies = category.movies || [];
        var results = movies.slice(index, index + COUNT);

        res.render('results', {
          title: 'imooc 结果列表页面',
          keyword: category.name,
          query: 'cat=' + catId,
          currentPage: +page + 1,
          totalPage: Math.ceil(movies.length / COUNT),
          results: results
        })
      });
  } else {
    Movie
      .find({title: new RegExp(q + '.*', 'i')})
      .exec((err, movies) => {
        if (err) {
          console.log(err);
        }

        var results = movies.slice(index, index + COUNT);

        res.render('results', {
          title: 'imooc 搜索结果页',
          keyword: q,
          query: 'q=' + q,
          currentPage: (page + 1),
          totalPage: Math.ceil(movies.length / COUNT),
          results: results
        })
      });
  }
};
