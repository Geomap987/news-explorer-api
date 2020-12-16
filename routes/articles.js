const router = require('express').Router();

const {
  getArticles,
  deleteArticleById,
  createArticle,
} = require('../controllers/article');

router.get('/articles', getArticles);
router.post('/articles', createArticle);
router.delete('/articles/:articleId', deleteArticleById);

module.exports = router;
