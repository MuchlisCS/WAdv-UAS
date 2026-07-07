import CommentSection from './CommentSection.jsx';

export default function PostList({ posts, loading, error, commentsByPost, token, onLoadComments, onAddComment }) {
  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p style={{ color: 'crimson' }}>{error}</p>;
  }

  if (!posts.length) {
    return <p>No posts yet. Be the first to start the conversation.</p>;
  }

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id} style={cardStyle}>
          <h3 style={{ margin: '0 0 8px' }}>{post.title}</h3>
          <p style={{ margin: '0 0 8px', color: '#4b5563' }}>{post.content}</p>
          <small style={{ color: '#6b7280' }}>Posted by {post.username}</small>

          <button onClick={() => onLoadComments(post.id)} style={secondaryButtonStyle}>
            Load comments
          </button>

          <CommentSection
            postId={post.id}
            comments={commentsByPost[post.id] || []}
            token={token}
            onAddComment={onAddComment}
          />
        </article>
      ))}
    </div>
  );
}

const cardStyle = {
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  padding: '16px',
  marginBottom: '12px',
  background: '#fff',
};

const secondaryButtonStyle = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  background: '#f9fafb',
  cursor: 'pointer',
  marginBottom: '12px',
};
