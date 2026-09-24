import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../context/ItemsContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../data/categories';
import ImageUploader from '../components/ImageUploader';

const TODAY = new Date().toISOString().slice(0, 10);

export default function PostItem() {
  const { user } = useAuth();
  const { addItem } = useItems();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialType = params.get('type') === 'found' ? 'found' : 'lost';

  const [form, setForm] = useState({
    type: initialType,
    title: '',
    category: CATEGORIES[0],
    description: '',
    location: '',
    date: TODAY,
    image: '',
  });
  const [errors, setErrors] = useState({});

  if (!user) {
    return (
      <div className="container post-page">
        <div className="signin-gate">
          <h1>Post a notice</h1>
          <p>Create a free account to post a lost or found notice &mdash; it takes about 30 seconds.</p>
          <div className="gate-actions">
            <button className="btn btn-primary" onClick={() => navigate('/signup', { state: { from: '/post' } })}>
              Create an account
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/login', { state: { from: '/post' } })}>
              Log in
            </button>
          </div>
        </div>
        <style>{`
          .post-page { padding: 60px 24px; }
          .signin-gate {
            max-width: 480px;
            margin: 0 auto;
            text-align: center;
            border: 1px solid var(--line);
            border-radius: var(--radius-m);
            padding: 40px 32px;
            background: var(--card);
          }
          .gate-actions { display: flex; gap: 12px; justify-content: center; margin-top: 20px; }
        `}</style>
      </div>
    );
  }

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Give the item a short, clear title.';
    if (!form.description.trim()) next.description = 'Add a few sentences of description.';
    if (!form.location.trim()) next.location = 'Where did this happen, roughly?';
    if (!form.date) next.date = 'Pick a date.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const item = addItem(
      {
        type: form.type,
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        location: form.location.trim(),
        date: form.date,
        image: form.image,
      },
      user
    );
    showToast('Your notice is live on the board.', 'teal');
    navigate(`/item/${item.id}`);
  }

  return (
    <div className="container post-page">
      <div className="page-head">
        <h1>Post a notice</h1>
        <p>Fill in as much detail as you can &mdash; specific descriptions get matched faster.</p>
      </div>

      <form className="post-form" onSubmit={handleSubmit} noValidate>
        <div className="type-toggle" role="group" aria-label="Notice type">
          <button
            type="button"
            className={form.type === 'lost' ? 'type-active type-lost' : ''}
            onClick={() => set('type', 'lost')}
          >
            I lost something
          </button>
          <button
            type="button"
            className={form.type === 'found' ? 'type-active type-found' : ''}
            onClick={() => set('type', 'found')}
          >
            I found something
          </button>
        </div>

        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Silver bike helmet"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
          />
          {errors.title && <div className="error-text">{errors.title}</div>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="date">{form.type === 'lost' ? 'Date lost' : 'Date found'}</label>
            <input id="date" type="date" max={TODAY} value={form.date} onChange={(e) => set('date', e.target.value)} />
            {errors.date && <div className="error-text">{errors.date}</div>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            placeholder="e.g. Riverside Park, near the fountain"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
          />
          {errors.location && <div className="error-text">{errors.location}</div>}
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Color, brand, distinguishing marks, what happened..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
          {errors.description && <div className="error-text">{errors.description}</div>}
        </div>

        <div className="field">
          <label>Photo (optional)</label>
          <ImageUploader value={form.image} onChange={(v) => set('image', v)} />
        </div>

        <div className="field contact-note">
          <label>Contact details</label>
          <p className="hint">
            People who message you about this notice will reach you at <strong>{user.email}</strong>
            {user.phone ? ` or ${user.phone}` : ''}. You can update these in your account.
          </p>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Post notice
        </button>
      </form>

      <style>{`
        .post-page { padding: 44px 24px 80px; }
        .page-head { max-width: 60ch; margin-bottom: 28px; }
        .post-form {
          max-width: 560px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius-m);
          padding: 30px;
        }
        .type-toggle {
          display: flex;
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-s);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .type-toggle button {
          flex: 1;
          border: none;
          background: var(--card);
          padding: 12px;
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          color: var(--ink-soft);
          border-right: 1px solid var(--line-strong);
        }
        .type-toggle button:last-child { border-right: none; }
        .type-toggle .type-lost { background: #f6e3dc; color: var(--rust-dark); }
        .type-toggle .type-found { background: #e2ede8; color: var(--teal-dark); }
        .contact-note { background: #f2efe6; border-radius: var(--radius-s); padding: 12px 14px; }
        .contact-note label { margin-bottom: 4px; }
        .contact-note p { margin: 0; }
      `}</style>
    </div>
  );
}
