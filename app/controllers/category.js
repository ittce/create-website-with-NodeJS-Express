var Category = require('../models/category');

exports.feature = function (req, res) {
  res.render('category_admin', {
    title: 'imooc 后台分类录入页面',
    category: {
      name: ''
    }
  })
};


exports.save = function (req, res) {
  var _category = req.body.category;
  var category = new Category(_category);

  category.save(function (err, category) {
    if (err) {
      console.log(err);
    }

    res.redirect('/admin/category/list');
  });
};

exports.list = function (req, res) {
  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err);
    }

    res.render('category_list', {
      title: 'imooc 电影分类列表页',
      categories: categories
    });
  });
};