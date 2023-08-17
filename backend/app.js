const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const user = require('./routes/users');
const card = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

require('dotenv').config();

const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const Reg = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://alina-mesto.nomoreparties.co'],
  credentials: true,
}));

mongoose.connect(DB_URL);

// 'mongodb://127.0.0.1:27017/mestodb'
// app.post('/signin', login);
// app.post('/signup', createUser);
app.use(requestLogger);
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.disable('x-powered-by');

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(Reg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use('/users', auth, user);
app.use('/cards', auth, card);

app.use(errorLogger);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
