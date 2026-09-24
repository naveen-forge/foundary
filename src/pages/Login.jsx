import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const result = login(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast('Welcome back!', 'teal');
    navigate(from, { replace: true });
  }

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h1>Log in</h1>
        <p>Access your posted notices and messages.</p>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Log in
          </button>
        </form>

        <p className="auth-switch">
          New to Foundry? <Link to="/signup">Create an account</Link>
        </p>
      </div>
      <style>{authStyles}</style>
    </div>
  );
}

export const authStyles = `
  .auth-page { padding: 60px 24px 90px; display: flex; justify-content: center; }
  .auth-card {
    width: 100%;
    max-width: 420px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius-m);
    padding: 34px 32px;
  }
  .auth-card h1 { margin-bottom: 6px; }
  .auth-switch { margin-top: 18px; font-size: 0.9rem; }
`;
