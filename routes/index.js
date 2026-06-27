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

module.exports = router;