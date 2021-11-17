const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 세션에 유저의 아이디만 저장 - 아이디만 저장하는 이유: 메모리 떄문, 실무에서는 메모리에도 저장하지 않음, done이 실행되면 auth login의 return으로 감
  });

  passport.deserializeUser((id, done) => { // 필요할 때 id로 user를 복구해줌. 브라우저가 session을 보내주면 passort session이 id를 알아냄 글고 deserial 한테 보냄
    User.findOne({ where: { id } })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
  kakao();
};
