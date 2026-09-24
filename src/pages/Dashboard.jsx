import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { itemsByOwner, messagesForItem } = useItems();

  const myItems = itemsByOwner(user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const active = myItems.filter((i) => i.status !== 'resolved');
  const resolved = myItems.filter((i) => i.status === 'resolved');
  const totalMessages = myItems.reduce((sum, item) => sum + messagesForItem(item.id).length, 0);

  return (
    <div className="container dashboard-page">
      <div className="page-head">
        <h1>My posts</h1>
        <p>Manage the notices you've posted and see who has reached out.</p>
      </div>

      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-num">{active.length}</div>
          <div>Active</div>
        </div>
        <div className="dash-stat">
          <div className="dash-num">{resolved.length}</div>
          <div>Resolved</div>
        </div>
        <div className="dash-stat">
          <div className="dash-num">{totalMessages}</div>
          <div>Messages received</div>
        </div>
        <Link to="/post" className="btn btn-amber dash-cta">
          Post a new notice
        </Link>
      </div>

      {myItems.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't posted anything yet</h3>
          <p>When you lose or find something, post it here so the community can help.</p>
          <Link to="/post" className="btn btn-primary">
            Post your first notice
          </Link>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section className="dash-section">
              <h2>Active</h2>
              <div className="item-grid">
                {active.map((item) => (
                  <DashCard key={item.id} item={item} messageCount={messagesForItem(item.id).length} />
                ))}
              </div>
            </section>
          )}
          {resolved.length > 0 && (
            <section className="dash-section">
              <h2>Resolved</h2>
              <div className="item-grid">
                {resolved.map((item) => (
                  <DashCard key={item.id} item={item} messageCount={messagesForItem(item.id).length} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <style>{`
        .dashboard-page { padding: 44px 24px 80px; }
        .page-head { max-width: 60ch; margin-bottom: 26px; }
        .dash-stats {
          display: flex;
          gap: 26px;
          align-items: center;
          flex-wrap: wrap;
          border: 1px solid var(--line);
          border-radius: var(--radius-m);
          padding: 20px 24px;
          margin-bottom: 36px;
          background: var(--card);
        }
        .dash-stat { text-align: left; }
        .dash-num {
          font-family: var(--font-head);
          font-size: 1.9rem;
          font-weight: 600;
          color: var(--teal-dark);
        }
        .dash-cta { margin-left: auto; }
        .dash-section { margin-bottom: 40px; }
        .dash-section h2 { margin-bottom: 16px; }
        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 20px;
        }
        .empty-state {
          border: 1px dashed var(--line-strong);
          border-radius: var(--radius-m);
          padding: 52px 24px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

function DashCard({ item, messageCount }) {
  return (
    <div className="dash-card-wrap">
      <ItemCard item={item} />
      {messageCount > 0 && (
        <Link to={`/item/${item.id}`} className="msg-badge">
          {messageCount} message{messageCount === 1 ? '' : 's'}
        </Link>
      )}
      <style>{`
        .dash-card-wrap { position: relative; }
        .msg-badge {
          display: inline-block;
          margin-top: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--amber-dark);
        }
      `}</style>
    </div>
  );
}
