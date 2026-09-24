import React, { createContext, useContext, useEffect, useState } from 'react';
import { readList, writeList, readValue, writeValue, removeValue, makeId } from '../utils/storage';

const AuthContext = createContext(null);

// NOTE: this is a client-only demo. Passwords are stored in localStorage
// as plain text purely so the app works without a server. Do not reuse
// this pattern for a real product.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readValue('session', null);
    if (session) {
      const users = readList('users');
      const found = users.find((u) => u.id === session.id);
      if (found) setUser(publicUser(found));
    }
    setReady(true);
  }, []);

  function publicUser(u) {
    return { id: u.id, name: u.name, email: u.email, phone: u.phone || '', createdAt: u.createdAt };
  }

  function signup({ name, email, password, phone }) {
    const users = readList('users');
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    const newUser = {
      id: makeId('user'),
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone?.trim() || '',
      createdAt: new Date().toISOString(),
    };
    writeList('users', [...users, newUser]);
    writeValue('session', { id: newUser.id });
    setUser(publicUser(newUser));
    return { ok: true };
  }

  function login({ email, password }) {
    const users = readList('users');
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: 'Email or password is incorrect.' };
    }
    writeValue('session', { id: found.id });
    setUser(publicUser(found));
    return { ok: true };
  }

  function logout() {
    removeValue('session');
    setUser(null);
  }

  function updateProfile(updates) {
    const users = readList('users');
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return { ok: false, error: 'User not found.' };
    const updated = { ...users[idx], ...updates };
    users[idx] = updated;
    writeList('users', users);
    setUser(publicUser(updated));
    return { ok: true };
  }

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
