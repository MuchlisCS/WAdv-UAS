import { useState } from 'react';

export default function PostForm({ onSubmit, token }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Please log in to create a post.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ title, content });
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.message || 'Unable to create post.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h2 style={{ marginBottom: '8px' }}>Create Post</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={inputStyle}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
        rows="4"
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
};

const buttonStyle = {
  padding: '10px 14px',
  border: 'none',
  borderRadius: '8px',
  background: '#2563eb',
  color: '#fff',
  cursor: 'pointer',
};
