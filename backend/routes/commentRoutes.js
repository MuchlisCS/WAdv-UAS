const express = require('express');
const { getCommentsForPost, createComment } = require('../controllers/commentController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/posts/:postId/comments', getCommentsForPost);
router.post('/comments', authenticate, createComment);

module.exports = router;
