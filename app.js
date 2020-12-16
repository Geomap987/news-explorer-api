require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const router = require('express').Router();
const { errors, celebrate } = require('celebrate');
const cors = require('cors');

const { PORT = 3001 } = process.env;
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users.js');
const articleRoutes = require('./routes/articles.js');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimiter');
const { createUserRequest, loginUserRequest } = require('./middlewares/request-validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, loginUser } = require('./controllers/user');

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(limiter);
app.use(requestLogger);

router.use('*', (req, res, next) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  next();
});

app.post('/signin', celebrate(loginUserRequest), loginUser);
app.post('/signup', celebrate(createUserRequest), createUser);

app.use('/', auth, userRoutes);
app.use('/', auth, articleRoutes);
app.use('/', router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
