const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

// dotenv는 require한 다음에 최대한 위에 적어주는것이 좋다.
// process env에 설정값이 들어가는게 config를 해줘야 적용이 되기 때문
dotenv.config();

const authRouter = require('./routes/auth');
const pageRouter = require('./routes/page');
const { sequelize } = require('./models');

const app = express();
app.set('port', process.env.PORT || 8001); // 개발은 8000, 배포는 8001 쓸 예정

//nunjucks 설정하는 방법
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({ force: false }) // true면 테이블을 지우고 다시 생성함
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/', pageRouter); //페이지 라우터 연결
app.use('/auth', authRouter);

//모든 라우터 뒤에 나오는 404 처리 미들웨어
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); //에러 미들웨어로 넘겨줌
});

// 에러 미들웨어 (인자가 4개인 특성, next 무조건 써야함)
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});
