const express = require('express');

const router = express.Router();


// progile page
router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

// join page
router.get('/join', (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

//main page
router.get('/', (req, res, next) => {
  const twits = []; // 대표 게시글 담을 배열
  res.render('main', {
    title: 'NodeBird',
    twits,
    user: req.user,
  });
});

module.exports = router;
