const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters long' });
    }

    const pool = await db.getPool();
    const [existingUsers] = await pool.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    const [rows] = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = ?', [result.insertId]);
    const user = rows[0];

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'forum-secret', {
      expiresIn: '7d',
    });

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register user' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const pool = await db.getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.trim().toLowerCase()]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'forum-secret', {
      expiresIn: '7d',
    });

    const { password: _, ...safeUser } = user;
    res.json({ message: 'Login successful', token, user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to login' });
  }
}

module.exports = {
  register,
  login,
};
