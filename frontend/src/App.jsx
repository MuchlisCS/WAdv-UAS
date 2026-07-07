import { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import PostForm from './components/PostForm.jsx';
import PostList from './components/PostList.jsx';

const API_BASE = '/api';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [commentsByPost, setCommentsByPost] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/posts`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load posts');
      setPosts(data.posts || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    setToken(data.token);
  }

  async function handleCreatePost({ title, content }) {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to create post');

    await loadPosts();
  }

  async function loadComments(postId) {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load comments');

    setCommentsByPost((prev) => ({ ...prev, [postId]: data.comments || [] }));
  }

  async function handleAddComment(postId, content) {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId, content }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to add comment');

    await loadComments(postId);
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '16px' }}>Gamers Forum</h1>
      <p style={{ marginBottom: '20px', color: '#4b5563' }}>A simple private forum for your gaming community.</p>

      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <p>You are logged in.</p>
          <button onClick={() => { localStorage.removeItem('token'); setToken(''); }} style={buttonStyle}>
            Logout
          </button>
        </div>
      )}

      <PostForm onSubmit={handleCreatePost} token={token} />

      <button onClick={loadPosts} style={secondaryButtonStyle}>
        Refresh Posts
      </button>

      <PostList
        posts={posts}
        loading={loading}
        error={error}
        commentsByPost={commentsByPost}
        token={token}
        onLoadComments={loadComments}
        onAddComment={handleAddComment}
      />
    </div>
  );
}

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '24px',
  fontFamily: 'Arial, sans-serif',
};

const buttonStyle = {
  padding: '10px 14px',
  border: 'none',
  borderRadius: '8px',
  background: '#dc2626',
  color: '#fff',
  cursor: 'pointer',
  marginBottom: '12px',
};

const secondaryButtonStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  background: '#f9fafb',
  cursor: 'pointer',
  marginBottom: '12px',
};

const cardStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  padding: '16px',
  marginBottom: '12px',
  background: '#fff',
};
