var express = require('express');
var router = express.Router();

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
  try {
    req.db.query('SELECT * FROM comments ORDER BY created_at DESC;', (err, results) => {
      if (err) {
        console.error('Error fetching comments:', err);
        return res.render('comments', {
          title: 'Customer Comments | Downtown Donuts', 
          comments: [],
          error: 'Unable to load comments right now.'
          });
      }

      res.render('comments', {
        title: 'Customer Comments | Downtown Donuts', 
        comments: results,
        error: null
      });
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.render('comments', {
      title: 'Customer Comments | Downtown Donuts', 
      comments: [],
      error: 'Unable to load comments right now.'
    });
  }
});

router.post('/comments', function(req, res, next) {
  const { name, comment } = req.body;

  try {
    req.db.query(
      'INSERT INTO comments (name, comment) VALUES (?, ?);', 
      [name, comment], 
      (err, results) => {
        if (err) {
          console.error('Error adding comment:', err);
          return res.status(500).send('Error adding comment');
        }

        res.redirect('/comments');
      }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

module.exports = router;