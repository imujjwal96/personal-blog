const express = require('express');
const blog = require('../services/blog');
const router = express.Router();
const crypto = require('crypto');

let spawn = require('child_process').spawn;

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
      'currentUrl': req.path,
  });
});

router.get('/posts', function(req, res, next) {
    res.render('posts', {
        'posts': req.posts,
        'page': req.page,
        'number': req.number,
        'currentUrl': req.path,
    });
});

// router.get('/resume', function (req, res, next) {
//   res.render('resume');
// });

router.post('/backdoor', function (req,res, next) {
  let hmac = crypto.createHmac('sha1', 'hello');
  const payload = req.body;

  hmac.update(JSON.stringify(payload));

  const calculatedSignature = 'sha1=' + hmac.digest('hex');

  if (req.headers['x-hub-signature'] === calculatedSignature) {
    const process = spawn("./redeploy.sh");

    process.on('exit', function (code) {
      console.log('child process exited with code ' + code);

    });
  } else {
    res.status(500);
  }

  res.end();
});

module.exports = router;
