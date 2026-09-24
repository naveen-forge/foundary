import React from 'react';
import { CATEGORIES } from '../data/categories';

export default function SearchFilter({ filters, onChange }) {
  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by title, description, or location..."
        value={filters.q}
        onChange={(e) => set('q', e.target.value)}
        aria-label="Search notices"
      />

      <div className="filter-row">
        <div className="seg-control" role="group" aria-label="Notice type">
          {['all', 'lost', 'found'].map((t) => (
            <button
              key={t}
              type="button"
              className={filters.type === t ? 'seg-active' : ''}
              onClick={() => set('type', t)}
            >
              {t === 'all' ? 'All' : t === 'lost' ? 'Lost' : 'Found'}
            </button>
          ))}
        </div>

        <select value={filters.category} onChange={(e) => set('category', e.target.value)} aria-label="Category">
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="show-resolved">
          <input
            type="checkbox"
            checked={filters.showResolved}
            onChange={(e) => set('showResolved', e.target.checked)}
          />
          Show resolved
        </label>
      </div>

      <style>{`
        .search-filter {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 30px;
        }
        .search-filter input[type="text"] {
          width: 100%;
          border: 1px solid var(--line-strong);
          background: var(--card);
          border-radius: var(--radius-s);
          padding: 13px 16px;
          font-size: 1rem;
        }
        .filter-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .seg-control {
          display: inline-flex;
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-s);
          overflow: hidden;
        }
        .seg-control button {
          border: none;
          background: var(--card);
          padding: 9px 16px;
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          color: var(--ink-soft);
          border-right: 1px solid var(--line-strong);
        }
        .seg-control button:last-child { border-right: none; }
        .seg-control button.seg-active {
          background: var(--ink);
          color: var(--paper);
        }
        .search-filter select {
          border: 1px solid var(--line-strong);
          background: var(--card);
          border-radius: var(--radius-s);
          padding: 9px 12px;
          font-size: 0.9rem;
        }
        .show-resolved {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.88rem;
          color: var(--ink-soft);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
