var mongoose = require('mongoose');
var Movie = require('../models/movie');
var Category = require('../models/category');

//index page
exports.index = function (req, res) {
  Category
    .find({})//把所有类别查出来
    .populate({
      path: 'movies',
      select: 'title poster',
      options : {limit : 5}
    }) //通过
    .exec(function (err, categories) {
      if (err) {
        console.log(err);
      }

      res.render('index',  {
        title : 'imooc 首页',
        categories: categories
      })
    });
};
