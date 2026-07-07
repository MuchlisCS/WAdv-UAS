const express = require('express');
const { createPost, getAllPosts, getPostById } = require('../controllers/postController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authenticate, createPost);

module.exports = router;
