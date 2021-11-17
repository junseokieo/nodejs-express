const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => { // 여기서 profile만 받아옴
    console.log('kakao profile', profile);
    try {
      const exUser = await User.findOne({
        where: { snsId: profile.id, provider: 'kakao' }, //카카오 가입한 사람 있는지 찾아보고
      });
      if (exUser) { // 있으면 성공
        done(null, exUser);
      } else {
        const newUser = await User.create({ // 없으면 회원가입 시키기
          email: profile._json && profile._json.kakao_account_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        done(null, newUser); // 그리고 로그인 시킴
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
