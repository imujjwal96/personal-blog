var express = require('express');
var blog = require('../services/blog');
var router = express.Router();


// Fetch first 5 blog posts
router.use(function(req, res, next) {
  blog.getPosts(5).then(function(posts) {
    req.posts = posts;
    next();
  })
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    'posts': req.posts
  });
});

module.exports = router;
