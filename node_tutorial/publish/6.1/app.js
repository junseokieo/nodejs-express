const express = require('express');


const path = require('path');
const morgan = require('morgan');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));

app.use((req, res, next) => {
    console.log('모든 요청에 실행하고 싶어요 !');
    next();
}, (req, res, next) => {
    try{
        console.log('hello');
    }catch (error){
        next(error);
    }
})

app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, './index.html'));
    res.json({hello: 'junse'});
    console.log('hello json');
});

app.post('/', (req, res) => {
    res.send('hello express');
});
app.get('/category/:name', (req, res) => {
    res.send(`hello ${req.params.name}`);
});
app.get('/about', (req, res) => {
    res.send('hello express');
});

app.use((req, res, next) => {
    res.status(404).send('404입니다');
})

// error 처리 미들웨어
// 모든 에러는 여기서 처리된다
app.use((err, req, res, next) => {
    console.error(err);
    res.status(200).send('에러가 났다아아아');
})

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});
