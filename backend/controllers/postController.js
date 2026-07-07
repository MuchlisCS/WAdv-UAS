const db = require('../config/db');

async function createPost(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }

    const pool = await db.getPool();
    const [result] = await pool.query(
      'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
      [req.user.id, title.trim(), content.trim()]
    );

    const [rows] = await pool.query(
      'SELECT p.id, p.title, p.content, p.created_at, p.user_id, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
      [result.insertId]
    );

    res.status(201).json({ message: 'Post created successfully', post: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create post' });
  }
}

async function getAllPosts(req, res) {
  try {
    const pool = await db.getPool();
    const [rows] = await pool.query(
      'SELECT p.id, p.title, p.content, p.created_at, p.user_id, u.username FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC'
    );

    res.json({ posts: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
}

async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const pool = await db.getPool();
    const [rows] = await pool.query(
      'SELECT p.id, p.title, p.content, p.created_at, p.user_id, u.username FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ post: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
};
