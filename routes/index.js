var express = require('express');
var blog = require('../services/blog');
var router = express.Router();

router.use(function(req, res, next) {
  req.page = req.query.page;
  if (req.page === undefined) {
      req.page = 1;
  }

  blog.getPostsNumber().then(function (number) {
      req.number = number;
      return number;
  }).then(function () {
      blog.getPosts(10, req.page).then(function(posts) {
          req.posts = posts;
          next();
      });
  })

});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    'posts': req.posts,
    'page': req.page,
    'number': req.number
  });
});

router.get('/resume', function (req, res, next) {
  res.render('resume');
});

module.exports = router;
