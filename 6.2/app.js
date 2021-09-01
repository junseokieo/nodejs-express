const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require("cookie-parser");

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(cookieParser);
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
  res.send('hello express!');
});

app.get('/category/Javascript', (req, res) => {
  res.send(`hello JavaScript`);
});

app.get('/category/:name', (req, res) => {
  res.send('hello wildcard');
});

app.use((req, res, next) => {
  res.status(400).send('404지롱');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(200).send('에러났지만 안알려줌');
});

app.listen(app.get('port'), () => {
  console.log('익스프레스 서버 실행');
});
