import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin({ email, password });
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h2 style={{ marginBottom: '8px' }}>Login</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={inputStyle}
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Logging in...' : 'Login'}
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
  background: '#16a34a',
  color: '#fff',
  cursor: 'pointer',
};
