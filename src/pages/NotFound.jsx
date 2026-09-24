import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container not-found">
      <h1>404</h1>
      <p>This page wandered off. Maybe someone will post it on the board.</p>
      <Link to="/" className="btn btn-primary">
        Back home
      </Link>
      <style>{`
        .not-found { padding: 90px 24px; text-align: center; }
        .not-found h1 { font-size: 4rem; }
      `}</style>
    </div>
  );
}
