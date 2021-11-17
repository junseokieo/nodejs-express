const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email', //req.body.email
    passwordField: 'password', //req.body.pw
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } }); // 이메일 가진 사람 찾기
      if (exUser) { // 이메일 가진 사람 있는 경우
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
          done(null, exUser); //done 인자 (서버에러, 성공한 경우, 실패시 메세지)
        } else { // 비밀번호 다른 경우
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else { // 이메일 가진 사람이 없을 때
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
