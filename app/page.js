"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/books');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType) => {
    if (userType === 'admin') {
      setEmail('admin@bookstore.com');
      setPassword('password123');
    } else if (userType === 'user') {
      setEmail('user@bookstore.com');
      setPassword('user123');
    }
  };

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '400px', 
        margin: '50px auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Bookstore Login
        </h1>
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#666', marginBottom: '1rem', fontSize: '1rem' }}>
            Demo Credentials:
          </h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              onClick={() => fillDemoCredentials('admin')}
            >
              Use Admin Account
            </button>
            <button 
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
              onClick={() => fillDemoCredentials('user')}
            >
              Use User Account
            </button>
          </div>
          
          <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.8rem' }}>
            <p><strong>Admin:</strong> admin@bookstore.com / password123</p>
            <p><strong>User:</strong> user@bookstore.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}