const router = require('express').Router();

router.get('/chat', (req, res) => {
  res.render('pages/chat');
});



router.get('/user', (req, res) => {
  res.render('pages/userInput');
});

router.get('/', (req, res) => {
  res.render('pages/userInput');
});

module.exports = router;
