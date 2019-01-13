var express = require('express');
var blog = require('../services/blog');
var router = express.Router();


// Fetch first 100 blog posts
router.use(function(req, res, next) {
  var page = req.query.page;
  if (page === undefined) {
    page = 1;
  }

  blog.getPosts(10, page).then(function(posts) {
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

router.get('/resume', function (req, res, next) {
    res.render('resume');
});

module.exports = router;
