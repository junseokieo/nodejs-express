const express = require('express');
const path = require('path');
const morgan = require('morgan');
const http = require('http');

const { sequelize, User } = require('./models');
const user = require('./models/user');
const { Router } = require('express');
const app = express();
const api = require('./api');
const dotenv = require('dotenv');

app.set('port', process.env.PORT || 8000);

sequelize.sync({ force: true })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.log(err);
    });

app.use(morgan('dev'));
dotenv.config();

// app.get('/', (req, res, next) => {
//     user.create({
//         name: "fly",
//         nickname: "yebin",
//         email: "yebin@naver.com",
//         password: "asdfasdf",
//         emailConfirmed: "0",
//     });
//     console.log('입력 성공');
// })

app.use(express.json());
app.use('/api', api);

// 404 middleware
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// error middleware
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'development' ? err : {};
    res.status(err.status || 500);
    res.send('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});
