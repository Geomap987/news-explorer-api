const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Error400 = require('../errors/Error400');
const Error401 = require('../errors/Error401');
const Error500 = require('../errors/Error500');
const { SALT_ROUND, JWT_SECRET } = require('../configs');

const { NODE_ENV } = process.env;

const getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user.id })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        const error400 = new Error400('Неправильный id');
        next(error400);
      }
      const error500 = new Error500('Ошибка на сервере');
      next(error500);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      const error400 = new Error400('Юзер с таким емейлом уже есть');
      next(error400);
    }
    bcrypt.hash(password, SALT_ROUND).then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
      .then((data) => res.send({
        name: data.name,
        email: data.email,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const errorList = Object.keys(err.errors);
          const messages = errorList.map((item) => err.errors[item].message);
          const error400 = new Error400(`Ошибка валидации: ${messages.join(' ')}`);
          next(error400);
        } else {
          const error500 = new Error500('Ошибка на сервере');
          next(error500);
        }
      });
  }).catch(() => {
    const error500 = new Error500('Ошибка на сервере');
    next(error500);
  });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error400 = new Error400('Не введен емейл или пароль');
    next(error400);
  }
  User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      const error401 = new Error401('Нет юзера с таким емейлом');
      next(error401);
    }
    bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        const token = jwt.sign({ id: user._id, email: user.email }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        return res.send({ token });
      }
      const error401 = new Error401('Неправильный пароль');
      next(error401);
    });
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      const errorList = Object.keys(err.errors);
      const messages = errorList.map((item) => err.errors[item].message);
      const error400 = new Error400(`Ошибка валидации: ${messages.join(' ')}`);
      next(error400);
    } else {
      const error500 = new Error500('Ошибка на сервере');
      next(error500);
    }
  });
};

module.exports = {
  getUserMe,
  createUser,
  loginUser,
};