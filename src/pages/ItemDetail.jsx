import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../context/ItemsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ItemDetail() {
  const { id } = useParams();
  const { getItem, deleteItem, markResolved, reopenItem, addMessage, messagesForItem } = useItems();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const item = getItem(id);
  const [messageText, setMessageText] = useState('');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestContact, setGuestContact] = useState(user?.email || '');
  const [sent, setSent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!item) {
    return (
      <div className="container item-detail">
        <h1>Notice not found</h1>
        <p>This notice may have been removed.</p>
        <Link to="/browse" className="btn btn-outline">
          Back to browse
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === item.ownerId;
  const isResolved = item.status === 'resolved';
  const thread = isOwner ? messagesForItem(item.id) : [];

  function handleSendMessage(e) {
    e.preventDefault();
    if (!messageText.trim() || !guestName.trim() || !guestContact.trim()) return;
    addMessage({
      itemId: item.id,
      fromUserId: user?.id || null,
      fromName: guestName.trim(),
      fromContact: guestContact.trim(),
      text: messageText.trim(),
    });
    setSent(true);
    setMessageText('');
    showToast('Message sent to the person who posted this notice.', 'teal');
  }

  function handleDelete() {
    deleteItem(item.id);
    showToast('Notice deleted.', 'rust');
    navigate('/dashboard');
  }

  const tagClass = isResolved ? 'tag-resolved' : item.type === 'lost' ? 'tag-lost' : 'tag-found';
  const tagLabel = isResolved ? (item.type === 'lost' ? 'Reunited' : 'Claimed') : item.type === 'lost' ? 'Lost' : 'Found';

  return (
    <div className="container item-detail">
      <Link to="/browse" className="back-link">
        &larr; Back to browse
      </Link>

      <div className="detail-grid">
        <div className="detail-media">
          {item.image ? (
            <img src={item.image} alt={item.title} />
          ) : (
            <div className="detail-media-placeholder">{item.category?.charAt(0) || '?'}</div>
          )}
        </div>

        <div className="detail-info">
          <span className={`tag ${tagClass}`}>
            <span className="tag-dot" />
            {tagLabel}
          </span>
          <h1>{item.title}</h1>
          <dl className="detail-facts">
            <div>
              <dt>Category</dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{item.location}</dd>
            </div>
            <div>
              <dt>{item.type === 'lost' ? 'Date lost' : 'Date found'}</dt>
              <dd>{formatDate(item.date)}</dd>
            </div>
            <div>
              <dt>Posted by</dt>
              <dd>{item.ownerName}</dd>
            </div>
          </dl>
          <p className="detail-desc">{item.description}</p>

          {isOwner ? (
            <div className="owner-actions">
              {isResolved ? (
                <button className="btn btn-outline" onClick={() => reopenItem(item.id)}>
                  Reopen notice
                </button>
              ) : (
                <button className="btn btn-teal" onClick={() => markResolved(item.id)}>
                  Mark as {item.type === 'lost' ? 'reunited' : 'claimed'}
                </button>
              )}
              {confirmDelete ? (
                <span className="confirm-row">
                  Delete this notice permanently?
                  <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                    Yes, delete
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </button>
                </span>
              ) : (
                <button className="btn btn-outline" onClick={() => setConfirmDelete(true)}>
                  Delete
                </button>
              )}
            </div>
          ) : (
            <div className="contact-card">
              <h3>{isResolved ? 'This notice has been resolved' : `Think this is yours, or you know whose it is?`}</h3>
              {isResolved ? (
                <p>It's no longer active, but you can still view the details above.</p>
              ) : sent ? (
                <p className="sent-confirm">
                  Thanks &mdash; your message has been sent to {item.ownerName}. They'll reach out using the contact
                  details you provided.
                </p>
              ) : (
                <form onSubmit={handleSendMessage} className="message-form">
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="guestName">Your name</label>
                      <input
                        id="guestName"
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="guestContact">Email or phone</label>
                      <input
                        id="guestContact"
                        type="text"
                        value={guestContact}
                        onChange={(e) => setGuestContact(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="messageText">Message</label>
                    <textarea
                      id="messageText"
                      placeholder="Describe how you can identify it, or where you saw it..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-amber btn-block">
                    Send message
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {isOwner && thread.length > 0 && (
        <div className="thread-section">
          <h2>Messages ({thread.length})</h2>
          <ul className="thread-list">
            {thread.map((m) => (
              <li key={m.id} className="thread-item">
                <div className="thread-head">
                  <strong>{m.fromName}</strong>
                  <span className="thread-contact">{m.fromContact}</span>
                  <span className="thread-date">{formatDate(m.createdAt)}</span>
                </div>
                <p>{m.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .item-detail { padding: 32px 24px 80px; }
        .back-link { display: inline-block; margin-bottom: 24px; font-size: 0.88rem; color: var(--ink-soft); }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .detail-media {
          aspect-ratio: 4 / 3;
          background: #ece6d8;
          border-radius: var(--radius-m);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .detail-media img { width: 100%; height: 100%; object-fit: cover; }
        .detail-media-placeholder { font-family: var(--font-head); font-size: 4rem; color: var(--ink-faint); }
        .detail-info h1 { margin-top: 10px; }
        .detail-facts {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
          margin: 20px 0;
          padding: 18px 0;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .detail-facts dt { font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-faint); margin-bottom: 3px; }
        .detail-facts dd { margin: 0; font-weight: 600; }
        .detail-desc { color: var(--ink); }
        .owner-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 18px; }
        .confirm-row { display: flex; gap: 8px; align-items: center; font-size: 0.88rem; color: var(--ink-soft); }
        .contact-card {
          margin-top: 24px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius-m);
          padding: 22px;
        }
        .contact-card h3 { font-size: 1.05rem; margin-bottom: 12px; }
        .sent-confirm { color: var(--teal-dark); margin: 0; }
        .thread-section { margin-top: 56px; max-width: 720px; }
        .thread-list { list-style: none; padding: 0; margin: 18px 0 0; display: flex; flex-direction: column; gap: 14px; }
        .thread-item { border: 1px solid var(--line); border-radius: var(--radius-s); padding: 14px 16px; background: var(--card); }
        .thread-head { display: flex; gap: 10px; align-items: baseline; font-size: 0.82rem; margin-bottom: 6px; flex-wrap: wrap; }
        .thread-contact { color: var(--teal-dark); }
        .thread-date { color: var(--ink-faint); margin-left: auto; }
        .thread-item p { margin: 0; color: var(--ink); }
        @media (max-width: 760px) {
          .detail-grid { grid-template-columns: 1fr; }
          .detail-facts { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
