import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authStyles } from './Login';

export default function Signup() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || location.state?.from || '/dashboard';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const result = signup(form);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    showToast('Account created &mdash; welcome to Foundry.', 'teal');
    navigate(from, { replace: true });
  }

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p>Post notices and get contacted when someone recognizes your item.</p>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
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
            <label htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
            <div className="hint">At least 6 characters.</div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Create account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
      <style>{authStyles}</style>
    </div>
  );
}
