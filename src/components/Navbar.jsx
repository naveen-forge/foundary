import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true" />
          Foundry
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/browse" onClick={() => setOpen(false)}>
            Browse
          </NavLink>
          <NavLink to="/post" onClick={() => setOpen(false)}>
            Post a notice
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>
                My posts
              </NavLink>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>
                Log in
              </NavLink>
              <Link to="/signup" className="btn btn-amber btn-sm" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--paper);
          border-bottom: 1px solid var(--line);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 68px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.35rem;
          color: var(--ink);
        }
        .brand:hover { text-decoration: none; }
        .brand-mark {
          width: 11px;
          height: 11px;
          border-radius: 50%;
          background: var(--amber);
          box-shadow: 4px 3px 0 0 var(--teal);
        }
        .nav-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .nav-toggle span {
          width: 22px;
          height: 2px;
          background: var(--ink);
          display: block;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 26px;
        }
        .nav-links a {
          color: var(--ink);
          font-weight: 500;
          font-size: 0.95rem;
        }
        .nav-links a.active {
          color: var(--teal-dark);
          font-weight: 700;
        }
        .nav-user {
          font-size: 0.88rem;
          color: var(--ink-soft);
          white-space: nowrap;
        }
        @media (max-width: 760px) {
          .nav-toggle { display: flex; }
          .nav-links {
            position: absolute;
            top: 68px;
            left: 0;
            right: 0;
            background: var(--paper);
            border-bottom: 1px solid var(--line);
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding: 18px 24px 24px;
            display: none;
          }
          .nav-links.open { display: flex; }
        }
      `}</style>
    </header>
  );
}
