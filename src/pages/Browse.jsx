import React, { useMemo, useState } from 'react';
import { useItems } from '../context/ItemsContext';
import SearchFilter from '../components/SearchFilter';
import ItemCard from '../components/ItemCard';

export default function Browse() {
  const { items } = useItems();
  const [filters, setFilters] = useState({ q: '', type: 'all', category: 'all', showResolved: false });

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return items
      .filter((item) => (filters.showResolved ? true : item.status !== 'resolved'))
      .filter((item) => (filters.type === 'all' ? true : item.type === filters.type))
      .filter((item) => (filters.category === 'all' ? true : item.category === filters.category))
      .filter((item) => {
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items, filters]);

  return (
    <div className="container browse-page">
      <div className="page-head">
        <h1>Browse notices</h1>
        <p>Search the board for something that matches what you lost, or scan recent finds.</p>
      </div>

      <SearchFilter filters={filters} onChange={setFilters} />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>Nothing matches yet</h3>
          <p>Try a different search term, or widen your filters. New notices are added all the time.</p>
        </div>
      ) : (
        <>
          <p className="result-count">
            {filtered.length} notice{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="item-grid">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}

      <style>{`
        .browse-page { padding: 44px 24px 72px; }
        .page-head { margin-bottom: 30px; max-width: 60ch; }
        .result-count {
          font-size: 0.85rem;
          color: var(--ink-faint);
          margin-bottom: 16px;
        }
        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px;
        }
        .empty-state {
          border: 1px dashed var(--line-strong);
          border-radius: var(--radius-m);
          padding: 48px 24px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
