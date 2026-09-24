import React from 'react';
import { Link } from 'react-router-dom';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ItemCard({ item }) {
  const isResolved = item.status === 'resolved';
  const tagClass = isResolved ? 'tag-resolved' : item.type === 'lost' ? 'tag-lost' : 'tag-found';
  const tagLabel = isResolved ? (item.type === 'lost' ? 'Reunited' : 'Claimed') : item.type === 'lost' ? 'Lost' : 'Found';

  return (
    <Link to={`/item/${item.id}`} className="item-card">
      <div className="item-media">
        {item.image ? (
          <img src={item.image} alt="" />
        ) : (
          <div className="item-media-placeholder">{item.category?.charAt(0) || '?'}</div>
        )}
        <span className={`tag ${tagClass} item-tag`}>
          <span className="tag-dot" />
          {tagLabel}
        </span>
      </div>
      <div className="item-body">
        <h3 className="item-title">{item.title}</h3>
        <div className="item-meta">
          <span>{item.category}</span>
          <span className="dot-sep">&middot;</span>
          <span>{item.location}</span>
        </div>
        <div className="item-date">{formatDate(item.date || item.createdAt)}</div>
      </div>

      <style>{`
        .item-card {
          display: flex;
          flex-direction: column;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius-m);
          overflow: hidden;
          color: var(--ink);
          transition: box-shadow 0.15s ease, transform 0.15s ease, border-color 0.15s ease;
        }
        .item-card:hover {
          text-decoration: none;
          box-shadow: var(--shadow-card);
          border-color: var(--line-strong);
          transform: translateY(-2px);
        }
        .item-media {
          position: relative;
          aspect-ratio: 4 / 3;
          background: #ece6d8;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .item-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-media-placeholder {
          font-family: var(--font-head);
          font-size: 2.6rem;
          color: var(--ink-faint);
        }
        .item-tag {
          position: absolute;
          top: 10px;
          left: 10px;
        }
        .item-body { padding: 14px 16px 16px; }
        .item-title {
          font-size: 1.02rem;
          margin-bottom: 6px;
        }
        .item-meta {
          font-size: 0.82rem;
          color: var(--ink-soft);
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .dot-sep { color: var(--ink-faint); }
        .item-date {
          font-size: 0.78rem;
          color: var(--ink-faint);
          margin-top: 8px;
        }
      `}</style>
    </Link>
  );
}
