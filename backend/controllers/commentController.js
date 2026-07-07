const db = require('../config/db');

async function getCommentsForPost(req, res) {
  try {
    const { postId } = req.params;
    const pool = await db.getPool();

    const [postRows] = await pool.query('SELECT id FROM posts WHERE id = ? LIMIT 1', [postId]);
    if (postRows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const [rows] = await pool.query(
      'SELECT c.id, c.post_id, c.content, c.created_at, c.user_id, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC',
      [postId]
    );

    res.json({ comments: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
}

async function createComment(req, res) {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ message: 'postId and content are required' });
    }

    const pool = await db.getPool();
    const [postRows] = await pool.query('SELECT id FROM posts WHERE id = ? LIMIT 1', [postId]);
    if (postRows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [postId, req.user.id, content.trim()]
    );

    const [rows] = await pool.query(
      'SELECT c.id, c.post_id, c.content, c.created_at, c.user_id, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ? LIMIT 1',
      [result.insertId]
    );

    res.status(201).json({ message: 'Comment created successfully', comment: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
}

module.exports = {
  getCommentsForPost,
  createComment,
};
