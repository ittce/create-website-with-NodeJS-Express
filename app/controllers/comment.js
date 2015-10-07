var Comment = require('../models/comment');

exports.save = function (req, res) {
  var _comment = req.body.comment;
  var movieId = _comment.movie;
  console.log(_comment.cid);
  if (_comment.cid) {
    console.log(_comment.cid);
    Comment.findById(_comment.cid, function(err, comment) {
      if (err) {
        console.log(err);
      }
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      };
      console.log(comment);
      comment.reply.push(reply);

      comment.save(function(err, comment) {
        if (err) {
          console.log(err);
        }

        res.redirect('/movie/' + movieId);
      });
    });
  } else {
    var comment = new Comment(_comment);
    comment.save(function (err, comment) {
      if (err) {
        console.log(err);
      }

      res.redirect('/movie/' + movieId);
    })
  }
};