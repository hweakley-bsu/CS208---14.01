var express = require('express');
var router = express.Router();
const validator = require('validator');

/* GET landing page. */
router.get('/', function(req, res, next){
  res.render('index', {
    title: 'Downtown Donuts'
  })
});

/* GET menu page. */
router.get('/menu', function(req, res, next) {
  res.render('menu', { title: 'Menu | Downtown Donuts' })
});

/* GET about page. */
router.get('/about', function(req, res,next) {
  res.render('about', { title: 'About Us | Downtown Donuts' });
});

/* GET comments page. */
router.get('/comments', function(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    req.db.query('SELECT COUNT(*) AS total FROM comments;', (countErr, countResults) => {
      if (countErr) {
        console.error('Error counting comments:', countErr);
        return res.render('comments', {
          title: 'Customer Comments | Downtown Donuts',
          comments: [],
          error: 'Unable to load comments right now.',
          currentPage: 1,
          totalPages: 1
        });
      }

      const totalComments = countResults[0].total;
      const totalPages = Math.ceil(totalComments / limit) || 1;

      req.db.query(
        'SELECT * FROM comments ORDER BY created_at DESC LIMIT ? OFFSET ?;',
        [limit, offset],
        (err, results) => {
          if (err) {
            console.error('Error fetching comments:', err);
            return res.render('comments', {
              title: 'Customer Comments | Downtown Donuts',
              comments: [],
              error: 'Unable to load comments right now.',
              currentPage: page,
              totalPages
            });
          }

          res.render('comments', {
            title: 'Customer Comments | Downtown Donuts',
            comments: results,
            error: null,
            currentPage: page,
            totalPages
          });
        }
      );
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.render('comments', {
      title: 'Customer Comments | Downtown Donuts',
      comments: [],
      error: 'Unable to load comments right now.',
      currentPage: 1,
      totalPages: 1
    });
  }
});

router.post('/comments', function(req, res, next) {
  let { name, comment } = req.body;

  name = validator.escape(name.trim());
  comment = validator.escape(comment.trim());

  if (!name || !comment) {
    return res.render('comments', {
      title: 'Customer Comments | Downtown Donuts',
      comments: [],
      error: 'Name and comment cannot be blank.',
      currentPage: 1,
      totalPages: 1
    });
  }

  if (name.length > 50 || comment.length > 500) {
    return res.render('comments', {
      title: 'Customer Comments | Downtown Donuts',
      comments: [],
      error: 'Name must be 50 characters or fewer, and comment must be 500 characters or fewer.',
      currentPage: 1,
      totalPages: 1
    });
  }

  try {
    req.db.query(
      'INSERT INTO comments (name, comment) VALUES (?, ?);',
      [name, comment],
      (err, results) => {
        if (err) {
          console.error('Error adding comment:', err);
          return res.render('comments', {
            title: 'Customer Comments | Downtown Donuts',
            comments: [],
            error: 'Unable to post your comment right now. Please try again later.',
            currentPage: 1,
            totalPages: 1
          });
        }

        res.redirect('/comments');
      }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    res.render('comments', {
      title: 'Customer Comments | Downtown Donuts',
      comments: [],
      error: 'Unable to post your comment right now. Please try again later.',
      currentPage: 1,
      totalPages: 1
    });
  }
});

module.exports = router;