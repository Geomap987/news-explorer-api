const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../configs');

const { NODE_ENV } = process.env;
const Error401 = require('../errors/Error401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    const error401 = new Error401('Необходима авторизация');
    next(error401);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    const error401 = new Error401('Необходима авторизация');
    next(error401);
  }

  req.user = payload;

  next();
};
