import React from 'react';
import { Link } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const { items } = useItems();
  const recent = items.filter((i) => i.status !== 'resolved').slice(0, 6);
  const lostCount = items.filter((i) => i.type === 'lost' && i.status !== 'resolved').length;
  const foundCount = items.filter((i) => i.type === 'found' && i.status !== 'resolved').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved').length;

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>
              Lost something?
              <br />
              Found something?
              <br />
              Pin it here.
            </h1>
            <p className="hero-sub">
              Foundry is a community noticeboard for the things that go missing &mdash; keys, pets, wallets,
              backpacks &mdash; and the neighbors who find them. Post a notice in under a minute.
            </p>
            <div className="hero-actions">
              <Link to="/post?type=lost" className="btn btn-primary">
                I lost something
              </Link>
              <Link to="/post?type=found" className="btn btn-teal">
                I found something
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-num">{lostCount}</div>
              <div className="stat-label">Active lost notices</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{foundCount}</div>
              <div className="stat-label">Active found notices</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{resolvedCount}</div>
              <div className="stat-label">Reunited so far</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container recent-section">
        <div className="section-head">
          <h2>Recent notices</h2>
          <Link to="/browse">Browse all &rarr;</Link>
        </div>
        {recent.length === 0 ? (
          <p>No notices yet &mdash; be the first to post one.</p>
        ) : (
          <div className="item-grid">
            {recent.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="container how-section">
        <h2>How it works</h2>
        <div className="how-grid">
          <div className="how-step">
            <h3>1. Post a notice</h3>
            <p>Describe what you lost or found, add a photo if you have one, and where it happened.</p>
          </div>
          <div className="how-step">
            <h3>2. Get matched</h3>
            <p>Anyone browsing the board can message you directly through the notice &mdash; no account required to read.</p>
          </div>
          <div className="how-step">
            <h3>3. Mark it resolved</h3>
            <p>Once an item finds its way home, mark the notice resolved so the board stays current for everyone.</p>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          background: var(--ink);
          color: var(--paper);
          padding: 64px 0 56px;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .hero h1 { color: var(--paper); }
        .hero-sub { color: #c9d2d6; max-width: 46ch; }
        .hero-actions { display: flex; gap: 14px; margin-top: 26px; flex-wrap: wrap; }
        .hero-stats {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .stat-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: var(--radius-m);
          padding: 18px 22px;
        }
        .stat-num {
          font-family: var(--font-head);
          font-size: 2.1rem;
          font-weight: 600;
          color: var(--amber);
        }
        .stat-label { color: #c9d2d6; font-size: 0.85rem; margin-top: 2px; }
        .recent-section { padding: 56px 24px 8px; }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 22px;
        }
        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px;
        }
        .how-section { padding: 56px 24px 72px; }
        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          margin-top: 22px;
        }
        .how-step {
          border-top: 3px solid var(--amber);
          padding-top: 14px;
        }
        .how-step:nth-child(2) { border-top-color: var(--teal); }
        .how-step:nth-child(3) { border-top-color: var(--rust); }
        @media (max-width: 860px) {
          .hero-inner { grid-template-columns: 1fr; }
          .how-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
