const { Joi } = require('celebrate');

const createUserRequest = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
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

const createArticleRequest = {
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
    image: Joi.string().required().regex(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/),
  }),
};

const deleteArticleRequest = {
  params: Joi.object().keys({
    articleId: Joi.string().min(24).max(24).hex()
      .required(),
  }).unknown(true),
};

module.exports = {
  createUserRequest,
  loginUserRequest,
  createArticleRequest,
  deleteArticleRequest,
};
