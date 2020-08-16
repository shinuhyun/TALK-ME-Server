require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 4000;

const questionRouter = require('./routes/question');
const roomRouter = require('./routes/room');
const roomListRouter = require('./routes/roomList');
const userRouter = require('./routes/user');

const sessionOptions = {
  secret: '@switzerland',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 3600000, // 쿠키 유효기간 1시간
  },
};

// production 환경일 경우
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sessionOptions.cookie.secure = true; // ssl 적용
}

app.use(session(sessionOptions));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(
  cors({
    origin: ['http://localhost:3000'],
    method: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

app.use(express.json());

app.use('/room/:roomId/questions', questionRouter);
app.use('/room', roomRouter);
app.use('/roomList', roomListRouter);
app.use('/auth', userRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
