import { useState } from 'react';

export default function CommentSection({ postId, comments, token, onAddComment }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Please log in to comment.');
      return;
    }

    if (!content.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      await onAddComment(postId, content);
      setContent('');
    } catch (err) {
      setError(err.message || 'Unable to add comment.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <h4 style={{ fontSize: '16px' }}>Comments</h4>
      {comments.length === 0 ? (
        <p style={{ color: '#6b7280' }}>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} style={{ padding: '8px 0', borderTop: '1px solid #f3f4f6' }}>
            <strong>{comment.username}</strong>: {comment.content}
          </div>
        ))
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows="2"
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Posting...' : 'Comment'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginBottom: '8px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
};

const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '8px',
  background: '#0f766e',
  color: '#fff',
  cursor: 'pointer',
};
