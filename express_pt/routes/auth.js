const express = require('express');
//const passport = require('passport');
//const bcrypt = require('bcrypt');
//const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
//const User = require('../models/user');

const router = express.Router();

router.post('/join', async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } }); // 기존 이메일에 있는지 검사 (프론트에서 알려주고 리다이렉트)
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => { // 미들웨어 확장 패턴 - localStartegy를 따라감 (local) , (authError, user, info) = done의 인자들
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => { // 로그인 성공한 경우, passport index의 done이 온 경우
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
  
      return res.redirect('/'); // 로그인 성공. 끝. 세션 쿠키를 브라우저로 보내줌
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout(); // 세션 쿠키를 지워버림
  req.session.destroy(); // 세션 파괴
  res.redirect('/');
});

// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/kakao/callback', passport.authenticate('kakao', {
//   failureRedirect: '/',
// }), (req, res) => {
//   res.redirect('/');
// });

module.exports = router;
