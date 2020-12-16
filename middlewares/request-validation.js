/* eslint-disable linebreak-style */
const { Joi } = require('celebrate');

const createUserRequest = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const loginUserRequest = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  createUserRequest,
  loginUserRequest,
};
