import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">Foundry</div>
          <p className="footer-tag">A noticeboard for the things that go missing, and the people who find them.</p>
        </div>
        <div className="footer-links">
          <Link to="/browse">Browse notices</Link>
          <Link to="/post">Post a notice</Link>
          <Link to="/dashboard">My posts</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>&copy; {new Date().getFullYear()} Foundry. A demo project &mdash; posts are stored only in your browser.</span>
      </div>  

      <style>{`
        .site-footer {
          margin-top: 64px;
          border-top: 1px solid var(--line);
          padding-top: 36px;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
          padding-bottom: 24px;
        }
        .footer-brand {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 6px;
        }
        .footer-tag { max-width: 40ch; margin: 0; }
        .footer-links {
          display: flex;
          gap: 22px;
          align-items: flex-start;
        }
        .footer-links a { color: var(--ink-soft); font-weight: 500; }
        .footer-bottom {
          border-top: 1px solid var(--line);
          padding: 16px 24px 28px;
          font-size: 0.82rem;
          color: var(--ink-faint);
        }
      `}</style>
    </footer>
  );
}
