# Foundry — Lost & Found Board

A community noticeboard for lost and found items, built with React, React Router,
and Vite. All data is stored in the browser's `localStorage`, so it runs with no
backend or database — great for a demo, a portfolio piece, or a starting point
for a real app.

## Features

- **Browse & search** — filter notices by type (lost/found), category, and free-text
  search across title, description, and location.
- **Post a notice** — form with title, category, description, location, date, and
  an optional photo (stored as a base64 data URL).
- **Item detail page** — full notice view with a contact/claim form so anyone can
  message the poster without needing an account.
- **Accounts** — simple sign up / log in (client-side only — see note below).
- **Dashboard ("My posts")** — see your own active and resolved notices, and how
  many messages each one received.
- **Resolve / reopen / delete** — poster-only controls on each notice.
- **Message inbox** — posters can read messages left on their notices from the
  item detail page.
- **Responsive design** — works down to mobile widths, with a corkboard-inspired
  visual identity (see the design notes below).
- **Toast notifications** for key actions (posting, resolving, sending a message).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     Reusable UI: Navbar, Footer, ItemCard, SearchFilter, etc.
  context/        React Context providers: Auth, Items, Toast
  data/           Static reference data (categories)
  pages/          Route-level pages (Home, Browse, PostItem, ItemDetail, ...)
  styles/         Global CSS and design tokens
  utils/          localStorage helpers
  App.jsx         Route definitions
  main.jsx        App entry point
```

## Important note on the demo auth

Sign up / log in is implemented entirely in the browser for demo purposes:
account records (including plain-text passwords) are saved to `localStorage`.
**Do not reuse this authentication approach in a real product.** A production
version should use a real backend with hashed passwords, sessions or JWTs, and
server-side validation.

## Design notes

The visual identity is meant to feel like a well-kept community noticeboard
rather than a generic SaaS dashboard: a warm paper background, a serif display
face (Fraunces) for headings, corner tags on notice cards for Lost/Found/Resolved
status, and an amber/teal/rust accent palette instead of the more common
terracotta-on-cream look.

## Ideas for extending this project

- Swap `localStorage` for a real backend (e.g. Supabase, Firebase, or a custom API).
- Add image hosting instead of storing base64 photos.
- Add email notifications when a message is left on a notice.
- Add a map view using item locations.
- Add pagination or infinite scroll for large boards.
